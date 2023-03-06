import { MutationObserverOptions, useMutation } from 'react-query';

import { ClaimRewardsInput, ClaimRewardsOutput, claimRewards, queryClient } from 'clients/api';
import { useMulticallContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ClaimRewardsOutput,
  Error,
  Omit<ClaimRewardsInput, 'multicallContract'>
>;

const useClaimRewards = (options?: Options) => {
  const multicallContract = useMulticallContract();

  return useMutation(
    FunctionKey.CLAIM_REWARDS,
    params =>
      claimRewards({
        multicallContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries([FunctionKey.GET_PENDING_REWARDS, variables.accountAddress]);
      },
    },
  );
};

export default useClaimRewards;
