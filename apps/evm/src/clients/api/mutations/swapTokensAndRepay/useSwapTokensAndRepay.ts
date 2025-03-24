import { type SwapTokensAndRepayInput, queryClient, swapTokensAndRepay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetSwapRouterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

type TrimmedSwapTokensAndRepayInput = Omit<
  SwapTokensAndRepayInput,
  'swapRouterContract' | 'vToken'
>;
type Options = UseSendTransactionOptions<TrimmedSwapTokensAndRepayInput>;

const useSwapTokensAndRepayAndRepay = (
  {
    vToken,
    poolComptrollerAddress,
    poolName,
  }: { vToken: VToken; poolComptrollerAddress: Address; poolName: string },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerContractAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: [FunctionKey.SWAP_TOKENS_AND_REPAY],
    fn: (input: TrimmedSwapTokensAndRepayInput) =>
      callOrThrow({ swapRouterContract }, params =>
        swapTokensAndRepay({
          vToken,
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens swapped and repaid', {
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
        routePath: input.swap.routePath,
        repaidFullLoan: input.repayFullLoan,
      });

      const accountAddress = await swapRouterContract?.signer.getAddress();

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
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.swap.fromToken.address,
            accountAddress,
            spenderAddress: swapRouterContract?.address,
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

export default useSwapTokensAndRepayAndRepay;
