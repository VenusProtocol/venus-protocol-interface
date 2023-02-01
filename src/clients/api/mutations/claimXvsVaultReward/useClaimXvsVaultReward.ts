import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimXvsVaultRewardInput,
  ClaimXvsVaultRewardOutput,
  claimXvsVaultReward,
  queryClient,
} from 'clients/api';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

type Options = MutationObserverOptions<
  ClaimXvsVaultRewardOutput,
  Error,
  Omit<ClaimXvsVaultRewardInput, 'xvsVaultContract'>
>;

const useClaimXvsVaultReward = (options?: Options) => {
  const xvsVaultContract = useXvsVaultContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_VAULT_REWARD,
    (params: Omit<ClaimXvsVaultRewardInput, 'xvsVaultContract'>) =>
      claimXvsVaultReward({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsVaultReward;
