import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import {
  SwapTokensAndSupplyInput,
  SwapTokensAndSupplyOutput,
  queryClient,
  swapTokensAndSupply,
} from 'clients/api';
import { useGetSwapRouterContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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
  { vToken, poolComptrollerAddress }: { vToken: VToken; poolComptrollerAddress: string },
  options?: Options,
) => {
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerAddress: poolComptrollerAddress,
  });

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
