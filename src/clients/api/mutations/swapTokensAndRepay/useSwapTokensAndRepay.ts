import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import {
  SwapTokensAndRepayInput,
  SwapTokensAndRepayOutput,
  queryClient,
  swapTokensAndRepay,
} from 'clients/api';
import { useSwapRouterContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  SwapTokensAndRepayOutput,
  Error,
  Omit<SwapTokensAndRepayInput, 'swapRouterContract' | 'vToken'>
>;

const useSwapTokensAndRepayAndRepay = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const swapRouterContract = useSwapRouterContract();

  return useMutation(
    FunctionKey.SWAP_TOKENS_AND_REPAY,
    params =>
      swapTokensAndRepay({
        swapRouterContract,
        vToken,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { swap } = onSuccessParams[1];
        const accountAddress = await swapRouterContract.signer.getAddress();

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
        queryClient.invalidateQueries(FunctionKey.GET_ISOLATED_POOLS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useSwapTokensAndRepayAndRepay;
