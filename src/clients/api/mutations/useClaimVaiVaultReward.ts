import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  claimVaiVaultReward,
  IClaimVaiVaultRewardInput,
  ClaimVaiVaultRewardOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiVaultContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimVaiVaultRewardOutput,
  Error,
  Omit<IClaimVaiVaultRewardInput, 'vaiVaultContract'>
>;

const useClaimVaiVaultReward = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.CLAIM_VAI_VAULT_REWARD,
    (params: Omit<IClaimVaiVaultRewardInput, 'vaiVaultContract'>) =>
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
