import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { MintVaiInput, MintVaiOutput, mintVai, queryClient } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedClaimRewardsInput = Omit<MintVaiInput, 'vaiControllerContract'>;
type Options = MutationObserverOptions<MintVaiOutput, Error, TrimmedClaimRewardsInput>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  return useMutation(
    FunctionKey.MINT_VAI,
    (input: TrimmedClaimRewardsInput) =>
      callOrThrow(
        {
          vaiControllerContract,
        },
        params =>
          mintVai({
            ...params,
            ...input,
          }),
      ),
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
