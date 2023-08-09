import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { SwapTokensInput, SwapTokensOutput, queryClient, swapTokens } from 'clients/api';
import { useGetSwapRouterContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedSwapTokensInput = Omit<SwapTokensInput, 'swapRouterContract'>;
type Options = MutationObserverOptions<SwapTokensOutput, Error, TrimmedSwapTokensInput>;

const useSwapTokens = (
  { poolComptrollerAddress }: { poolComptrollerAddress: string },
  options?: Options,
) => {
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerAddress: poolComptrollerAddress,
  });

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
