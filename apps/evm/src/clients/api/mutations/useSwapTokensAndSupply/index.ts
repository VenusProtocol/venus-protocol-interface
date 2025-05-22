import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { swapRouterAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Swap, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { generateTransactionDeadline } from 'utilities/generateTransactionDeadline';
import type { Address, ContractFunctionArgs } from 'viem';

export interface SwapTokensAndSupplyInput {
  swapRouterContractAddress: Address;
  swap: Swap;
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
    name: 'SwapRouter',
    poolComptrollerContractAddress: poolComptrollerAddress,
  });

  return useSendTransaction<
    TrimmedSwapTokensAndSupplyInput,
    typeof swapRouterAbi,
    'swapExactTokensForTokensAndSupply' | 'swapExactBNBForTokensAndSupply',
    ContractFunctionArgs<
      typeof swapRouterAbi,
      'nonpayable' | 'payable',
      'swapExactTokensForTokensAndSupply' | 'swapExactBNBForTokensAndSupply'
    >
  >({
    fn: ({ swap }: TrimmedSwapTokensAndSupplyInput) => {
      const transactionDeadline = generateTransactionDeadline();

      if (!swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Sell fromTokens to supply as many toTokens as possible
      if (
        swap.direction === 'exactAmountIn' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          abi: swapRouterAbi,
          address: swapRouterContractAddress,
          functionName: 'swapExactTokensForTokensAndSupply' as const,
          args: [
            vToken.address,
            BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath as Address[],
            transactionDeadline,
          ],
        } as const;
      }

      // Sell BNBs to supply as many toTokens as possible
      if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
        return {
          abi: swapRouterAbi,
          address: swapRouterContractAddress,
          functionName: 'swapExactBNBForTokensAndSupply' as const,
          args: [
            vToken.address,
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath as Address[],
            transactionDeadline,
          ],
          value: BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
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
        fromTokenSymbol: input.swap.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          token: input.swap.fromToken,
          value:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.fromTokenAmountSoldMantissa
              : input.swap.expectedFromTokenAmountSoldMantissa,
        }).toNumber(),
        toTokenSymbol: input.swap.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: input.swap.toToken,
          value:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.expectedToTokenAmountReceivedMantissa
              : input.swap.toTokenAmountReceivedMantissa,
        }).toNumber(),
        priceImpactPercentage: input.swap.priceImpactPercentage,
        slippageTolerancePercentage: SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: input.swap.exchangeRate.toNumber(),
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
