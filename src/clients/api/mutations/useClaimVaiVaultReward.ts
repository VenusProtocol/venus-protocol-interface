import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimVaiVaultRewardInput,
  ClaimVaiVaultRewardOutput,
  claimVaiVaultReward,
  queryClient,
} from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ClaimVaiVaultRewardOutput,
  Error,
  Omit<ClaimVaiVaultRewardInput, 'vaiVaultContract'>
>;

const useClaimVaiVaultReward = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.CLAIM_VAI_VAULT_REWARD,
    (params: Omit<ClaimVaiVaultRewardInput, 'vaiVaultContract'>) =>
      claimVaiVaultReward({
        vaiVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_VAI_VAULT_PENDING_XVS_WEI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimVaiVaultReward;
