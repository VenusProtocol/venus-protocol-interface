import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { swapRouterV2Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { ExactInSwapQuote, ExactOutSwapQuote, SwapQuote, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import type { Address, ContractFunctionArgs } from 'viem';

export interface SwapTokensAndSupplyInput {
  swapRouterContractAddress: Address;
  swapQuote: SwapQuote;
  vToken: VToken;
}

type TrimmedSwapTokensAndSupplyInput = Omit<
  SwapTokensAndSupplyInput,
  'swapRouterContractAddress' | 'vToken'
>;
type Options = UseSendTransactionOptions<TrimmedSwapTokensAndSupplyInput>;

export const useSwapTokensAndSupply = (
  {
    vToken,
    poolComptrollerAddress,
    poolName,
    isSwappingNative,
  }: {
    vToken: VToken;
    poolComptrollerAddress: Address;
    poolName: string;
    isSwappingNative: boolean;
  },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouterV2',
  });

  return useSendTransaction<
    TrimmedSwapTokensAndSupplyInput,
    typeof swapRouterV2Abi,
    'swapAndSupply' | 'swapNativeAndSupply',
    ContractFunctionArgs<
      typeof swapRouterV2Abi,
      'nonpayable' | 'payable',
      'swapAndSupply' | 'swapNativeAndSupply'
    >
  >({
    fn: ({ swapQuote }: TrimmedSwapTokensAndSupplyInput) => {
      if (!swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }
      // Sell fromTokens to supply as many toTokens as possible
      if (swapQuote.direction === 'exact-in' && !isSwappingNative) {
        return {
          abi: swapRouterV2Abi,
          address: swapRouterContractAddress,
          functionName: 'swapAndSupply' as const,
          args: [
            vToken.address,
            swapQuote.fromToken.address,
            swapQuote.fromTokenAmountSoldMantissa,
            swapQuote.minimumToTokenAmountReceivedMantissa,
            swapQuote.callData,
          ],
        } as const;
      }

      // Sell BNBs to supply as many toTokens as possible
      if (swapQuote.direction === 'exact-in' && isSwappingNative) {
        return {
          abi: swapRouterV2Abi,
          address: swapRouterContractAddress,
          functionName: 'swapNativeAndSupply' as const,
          args: [
            vToken.address,
            swapQuote.minimumToTokenAmountReceivedMantissa,
            swapQuote.callData,
          ],
          value: swapQuote.fromTokenAmountSoldMantissa,
        } as const;
      }

      throw new VError({
        type: 'unexpected',
        code: 'incorrectSwapInput',
      });
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens swapped and supplied', {
        poolName,
        fromTokenSymbol: input.swapQuote.fromToken.symbol,
        fromTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.swapQuote.fromToken,
            value:
              input.swapQuote.direction === 'exact-in'
                ? (input.swapQuote as ExactInSwapQuote).fromTokenAmountSoldMantissa
                : (input.swapQuote as ExactOutSwapQuote).expectedFromTokenAmountSoldMantissa,
          }) ?? '0'
        ).toNumber(),
        toTokenSymbol: input.swapQuote.toToken.symbol,
        toTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.swapQuote.toToken,
            value:
              input.swapQuote.direction === 'exact-in'
                ? (input.swapQuote as ExactInSwapQuote).expectedToTokenAmountReceivedMantissa
                : (input.swapQuote as ExactOutSwapQuote).toTokenAmountReceivedMantissa,
          }) ?? '0'
        ).toNumber(),
        priceImpactPercentage: input.swapQuote.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swapQuote.fromToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.swapQuote.fromToken.address,
            accountAddress,
            spenderAddress: poolComptrollerAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swapQuote.toToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });
    },
    options,
  });
};
