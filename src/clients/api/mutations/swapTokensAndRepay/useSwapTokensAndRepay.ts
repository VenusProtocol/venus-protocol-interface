import { useAnalytics } from 'packages/analytics';
import { useGetSwapRouterContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { SwapTokensAndRepayInput, queryClient, swapTokensAndRepay } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

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
  }: { vToken: VToken; poolComptrollerAddress: string; poolName: string },
  options?: Options,
) => {
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerContractAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.SWAP_TOKENS_AND_REPAY,
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
        fromTokenAmountTokens: convertWeiToTokens({
          token: input.swap.fromToken,
          valueWei:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.fromTokenAmountSoldWei
              : input.swap.expectedFromTokenAmountSoldWei,
        }).toNumber(),
        toTokenSymbol: input.swap.toToken.symbol,
        toTokenAmountTokens: convertWeiToTokens({
          token: input.swap.toToken,
          valueWei:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.expectedToTokenAmountReceivedWei
              : input.swap.toTokenAmountReceivedWei,
        }).toNumber(),
        priceImpactPercentage: input.swap.priceImpactPercentage,
        slippageTolerancePercentage: SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: input.swap.exchangeRate.toNumber(),
        routePath: input.swap.routePath,
        repaidFullLoan: input.isRepayingFullLoan,
      });

      const accountAddress = await swapRouterContract?.signer.getAddress();

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          accountAddress,
          tokenAddress: input.swap.fromToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          accountAddress,
          tokenAddress: input.swap.toToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          tokenAddress: input.swap.fromToken.address,
          accountAddress,
          spenderAddress: swapRouterContract?.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useSwapTokensAndRepayAndRepay;
