import { MutationObserverOptions, useMutation } from 'react-query';

import { queryClient, mintVai, IMintVaiInput, MintVaiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  MintVaiOutput,
  Error,
  Omit<IMintVaiInput, 'vaiControllerContract'>
>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitrollerContract();

  return useMutation(
    FunctionKey.MINT_VAI,
    (params: Omit<IMintVaiInput, 'vaiControllerContract'>) =>
      mintVai({
        vaiControllerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Invalidate queries related to fetching the user minted VAI amount
        queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_STATE);
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useMintVai;
