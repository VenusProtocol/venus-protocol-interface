import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimXvsVaultRewardOutput,
  IClaimXvsVaultRewardInput,
  claimXvsVaultReward,
  queryClient,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';

type Options = MutationObserverOptions<
  ClaimXvsVaultRewardOutput,
  Error,
  Omit<IClaimXvsVaultRewardInput, 'xvsVaultContract'>
>;

const useClaimXvsVaultReward = (options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.CLAIM_XVS_VAULT_REWARD,
    (params: Omit<IClaimXvsVaultRewardInput, 'xvsVaultContract'>) =>
      claimXvsVaultReward({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD_WEI,
          { accountAddress: fromAccountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimXvsVaultReward;
