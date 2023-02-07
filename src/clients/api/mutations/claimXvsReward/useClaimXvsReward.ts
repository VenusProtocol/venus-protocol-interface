import { MutationObserverOptions, useMutation } from 'react-query';

import { ClaimXvsRewardOutput, claimXvsReward, queryClient } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<ClaimXvsRewardOutput, Error>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    () =>
      claimXvsReward({
        comptrollerContract,
      }),
    {
      ...options,
      onSuccess: () => {
        queryClient.resetQueries(FunctionKey.GET_PENDING_REWARDS);
      },
    },
  );
};

export default useClaimXvsReward;
