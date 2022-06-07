import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  claimXvsReward,
  IClaimXvsRewardInput,
  ClaimXvsRewardOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimXvsRewardOutput,
  Error,
  Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>
>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    (params: Omit<IClaimXvsRewardInput, 'comptrollerContract' | 'venusLensContract'>) =>
      claimXvsReward({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.resetQueries(FunctionKey.GET_XVS_REWARD);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsReward;
