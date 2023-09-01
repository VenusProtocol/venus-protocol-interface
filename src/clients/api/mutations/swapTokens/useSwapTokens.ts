import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { SwapTokensInput, SwapTokensOutput, queryClient, swapTokens } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useAnalytics } from 'context/Analytics';
import useGetSwapRouterContract from 'hooks/useGetSwapRouterContract';

type TrimmedSwapTokensInput = Omit<SwapTokensInput, 'swapRouterContract'>;
type Options = MutationObserverOptions<SwapTokensOutput, Error, TrimmedSwapTokensInput>;

const useSwapTokens = (
  { poolComptrollerAddress }: { poolComptrollerAddress: string },
  options?: Options,
) => {
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.SWAP_TOKENS,
    (input: TrimmedSwapTokensInput) =>
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
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { swap } = onSuccessParams[1];

        captureAnalyticEvent('Tokens swapped', {
          fromTokenSymbol: swap.fromToken.symbol,
          fromTokenAmountTokens: convertWeiToTokens({
            token: swap.fromToken,
            valueWei:
              swap.direction === 'exactAmountIn'
                ? swap.fromTokenAmountSoldWei
                : swap.expectedFromTokenAmountSoldWei,
          }).toNumber(),
          toTokenSymbol: swap.toToken.symbol,
          toTokenAmountTokens: convertWeiToTokens({
            token: swap.toToken,
            valueWei:
              swap.direction === 'exactAmountIn'
                ? swap.expectedToTokenAmountReceivedWei
                : swap.toTokenAmountReceivedWei,
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
            accountAddress,
            tokenAddress: swap.fromToken.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: swap.toToken.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: swap.fromToken.address,
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
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSwapTokens;
