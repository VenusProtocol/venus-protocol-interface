import { useAnalytics } from 'libs/analytics';
import { useGetSwapRouterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';

import { SwapTokensInput, queryClient, swapTokens } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedSwapTokensInput = Omit<SwapTokensInput, 'swapRouterContract'>;
type Options = UseSendTransactionOptions<TrimmedSwapTokensInput>;

const useSwapTokens = (
  { poolComptrollerAddress }: { poolComptrollerAddress: string },
  options?: Options,
) => {
  const { chainId } = useChainId();
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerContractAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.SWAP_TOKENS,
    fn: (input: TrimmedSwapTokensInput) =>
      callOrThrow(
        {
          swapRouterContract,
        },
        params =>
          swapTokens({
            ...params,
            ...input,
          }),
      ),
    onConfirmed: async ({ input }) => {
      const { swap } = input;

      captureAnalyticEvent('Tokens swapped', {
        fromTokenSymbol: swap.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          token: swap.fromToken,
          value:
            swap.direction === 'exactAmountIn'
              ? swap.fromTokenAmountSoldMantissa
              : swap.expectedFromTokenAmountSoldMantissa,
        }).toNumber(),
        toTokenSymbol: swap.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: swap.toToken,
          value:
            swap.direction === 'exactAmountIn'
              ? swap.expectedToTokenAmountReceivedMantissa
              : swap.toTokenAmountReceivedMantissa,
        }).toNumber(),
        priceImpactPercentage: swap.priceImpactPercentage,
        slippageTolerancePercentage: SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: swap.exchangeRate.toNumber(),
        routePath: swap.routePath,
      });

      const accountAddress = await swapRouterContract?.signer.getAddress();

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: swap.fromToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: swap.toToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId,
          tokenAddress: swap.fromToken.address,
          accountAddress,
          spenderAddress: swapRouterContract?.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
      queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);
      queryClient.invalidateQueries(FunctionKey.GET_LEGACY_POOL);
      queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);
    },
    options,
  });
};

export default useSwapTokens;
