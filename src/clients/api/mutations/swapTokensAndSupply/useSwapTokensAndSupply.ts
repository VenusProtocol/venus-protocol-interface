import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  SwapTokensAndSupplyInput,
  SwapTokensAndSupplyOutput,
  queryClient,
  swapTokensAndSupply,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useAnalytics } from 'context/Analytics';
import useGetSwapRouterContract from 'hooks/useGetSwapRouterContract';

type TrimmedSwapTokensAndSupplyInput = Omit<
  SwapTokensAndSupplyInput,
  'swapRouterContract' | 'vToken'
>;
type Options = MutationObserverOptions<
  SwapTokensAndSupplyOutput,
  Error,
  TrimmedSwapTokensAndSupplyInput
>;

const useSwapTokensAndSupply = (
  {
    vToken,
    poolComptrollerAddress,
    poolName,
  }: { vToken: VToken; poolComptrollerAddress: string; poolName: string },
  options?: Options,
) => {
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.SWAP_TOKENS_AND_SUPPLY,
    (input: TrimmedSwapTokensAndSupplyInput) =>
      callOrThrow({ swapRouterContract }, params =>
        swapTokensAndSupply({
          vToken,
          ...input,
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { swap } = onSuccessParams[1];

        captureAnalyticEvent('Tokens swapped and supplied', {
          poolName,
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
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: swap.fromToken.address,
            accountAddress,
            spenderAddress: swapRouterContract?.address,
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

export default useSwapTokensAndSupply;
