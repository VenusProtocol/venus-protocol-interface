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
  swap: SwapQuote;
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
  }: { vToken: VToken; poolComptrollerAddress: Address; poolName: string },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouterV2',
    // poolComptrollerContractAddress: poolComptrollerAddress,
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
    fn: ({ swap }: TrimmedSwapTokensAndSupplyInput) => {
      // const transactionDeadline = generateTransactionDeadline();

      if (!swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Sell fromTokens to supply as many toTokens as possible
      if (swap.direction === 'exact-in' && !swap.fromToken.isNative && !swap.toToken.isNative) {
        return {
          abi: swapRouterV2Abi,
          address: swapRouterContractAddress,
          functionName: 'swapAndSupply' as const,
          args: [
            vToken.address,
            swap.toToken.address,
            swap.fromTokenAmountSoldMantissa,
            swap.minimumToTokenAmountReceivedMantissa,
            swap.callData,
            // transactionDeadline,
          ],
        } as const;
      }

      // Sell BNBs to supply as many toTokens as possible
      if (swap.direction === 'exact-in' && swap.fromToken.isNative && !swap.toToken.isNative) {
        return {
          abi: swapRouterV2Abi,
          address: swapRouterContractAddress,
          functionName: 'swapNativeAndSupply' as const,
          args: [
            vToken.address,
            swap.minimumToTokenAmountReceivedMantissa,
            swap.callData,
            // transactionDeadline,
          ],
          value: swap.fromTokenAmountSoldMantissa,
        } as const;
      }

      throw new VError({
        type: 'unexpected',
        code: 'incorrectSwapInput',
      });
    },
    onConfirmed: async ({ input }) => {
      // TODO: resolve args
      if (!input?.swap) return;
      captureAnalyticEvent('Tokens swapped and supplied', {
        poolName,
        fromTokenSymbol: input.swap.fromToken.symbol,
        fromTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.swap.fromToken,
            value:
              input.swap.direction === 'exact-in'
                ? (input.swap as ExactInSwapQuote).fromTokenAmountSoldMantissa
                : (input.swap as ExactOutSwapQuote).expectedFromTokenAmountSoldMantissa,
          }) ?? '0'
        ).toNumber(),
        toTokenSymbol: input.swap.toToken.symbol,
        toTokenAmountTokens: (
          convertMantissaToTokens({
            token: input.swap.toToken,
            value:
              input.swap.direction === 'exact-in'
                ? (input.swap as ExactInSwapQuote).expectedToTokenAmountReceivedMantissa
                : (input.swap as ExactOutSwapQuote).toTokenAmountReceivedMantissa,
          }) ?? '0'
        ).toNumber(),
        priceImpactPercentage: input.swap.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
        // exchangeRate: input.swap.exchangeRate.toNumber(),
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swap.fromToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.swap.fromToken.address,
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
            tokenAddress: input.swap.toToken.address,
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
