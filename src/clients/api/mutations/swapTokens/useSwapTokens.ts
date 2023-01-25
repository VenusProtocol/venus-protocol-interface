import { MutationObserverOptions, useMutation } from 'react-query';

import { SwapTokensInput, SwapTokensOutput, queryClient, swapTokens } from 'clients/api';
import { usePancakeRouterContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  SwapTokensOutput,
  Error,
  Omit<SwapTokensInput, 'pancakeRouterContract'>
>;

const useSwapTokens = (options?: Options) => {
  const pancakeRouterContract = usePancakeRouterContract();

  return useMutation(
    FunctionKey.SWAP_TOKENS,
    (params: Omit<SwapTokensInput, 'pancakeRouterContract'>) =>
      swapTokens({
        pancakeRouterContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { swap } = onSuccessParams[1];
        const accountAddress = await pancakeRouterContract.signer.getAddress();

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
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_MAIN_MARKETS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSwapTokens;
