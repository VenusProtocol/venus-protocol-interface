import { MutationObserverOptions, useMutation } from 'react-query';

import { MintVaiInput, MintVaiOutput, mintVai, queryClient } from 'clients/api';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  MintVaiOutput,
  Error,
  Omit<MintVaiInput, 'vaiControllerContract'>
>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useVaiControllerContract();

  return useMutation(
    FunctionKey.MINT_VAI,
    (params: Omit<MintVaiInput, 'vaiControllerContract'>) =>
      mintVai({
        vaiControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useMintVai;
