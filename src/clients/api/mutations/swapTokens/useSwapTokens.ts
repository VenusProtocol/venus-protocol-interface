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
      onSuccess: (...onSuccessParams) => {
        const { fromAccountAddress, swap } = onSuccessParams[1];
        // TODO: invalidate getBalanceOf query
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          swap.fromToken.id,
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSwapTokens;
