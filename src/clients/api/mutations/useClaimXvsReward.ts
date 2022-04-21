import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  claimXvsReward,
  IClaimXvsRewardInput,
  ClaimXvsRewardOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract, useVenusLensContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimXvsRewardOutput,
  Error,
  Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>
>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();
  const venusLensContract = useVenusLensContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    (params: Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>) =>
      claimXvsReward({
        comptrollerContract,
        venusLensContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Trigger refetch of XVS reward
        queryClient.invalidateQueries(FunctionKey.GET_MINTED_VAI);
        queryClient.invalidateQueries(FunctionKey.GET_VENUS_ACCRUED);
        queryClient.invalidateQueries(FunctionKey.GET_XVS_REWARD);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsReward;
