import { VError } from 'errors';
import { MutationObserverOptions, useMutation } from 'react-query';

import { MintVaiInput, MintVaiOutput, mintVai, queryClient } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

type HandleClaimRewardsInput = Omit<MintVaiInput, 'vaiControllerContract'>;
type Options = MutationObserverOptions<MintVaiOutput, Error, HandleClaimRewardsInput>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  const handleClaimRewards = (input: HandleClaimRewardsInput) => {
    if (!vaiControllerContract) {
      logError('Contract infos missing for mintVai mutation function call');
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return mintVai({
      vaiControllerContract,
      ...input,
    });
  };

  return useMutation(FunctionKey.MINT_VAI, handleClaimRewards, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      // Invalidate queries related to fetching the user minted VAI amount
      queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
      queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });
};

export default useMintVai;
