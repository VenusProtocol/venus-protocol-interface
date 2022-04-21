import { MutationObserverOptions, useMutation } from 'react-query';

import { claimXvsReward, IClaimXvsRewardInput, ClaimXvsRewardOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimXvsRewardOutput,
  Error,
  Omit<IClaimXvsRewardInput, 'vaiControllerContract'>
>;

const useClaimXvsReward = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  // @TODO: invalidate queries related to fetching the user claimable XVS
  // balance
  return useMutation(
    FunctionKey.CLAIM_XVS_REWARD,
    (params: Omit<IClaimXvsRewardInput, 'comptrollerContract'>) =>
      claimXvsReward({
        comptrollerContract,
        ...params,
      }),
    options,
  );
};

export default useClaimXvsReward;
