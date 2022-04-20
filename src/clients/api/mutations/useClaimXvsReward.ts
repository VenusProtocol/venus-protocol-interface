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
  Omit<IClaimXvsRewardInput, 'vaiControllerContract'>
>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    (params: Omit<IClaimXvsRewardInput, 'comptrollerContract'>) =>
      claimXvsReward({
        comptrollerContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        // Trigger refetch of XVS reward
        queryClient.invalidateQueries(FunctionKey.GET_XVS_REWARD);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsReward;
