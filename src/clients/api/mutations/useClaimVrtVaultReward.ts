import { MutationObserverOptions, useMutation } from 'react-query';

import {
  ClaimVrtVaultRewardOutput,
  IClaimVrtVaultRewardInput,
  claimVrtVaultReward,
  queryClient,
} from 'clients/api';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ClaimVrtVaultRewardOutput,
  Error,
  Omit<IClaimVrtVaultRewardInput, 'vrtVaultContract'>
>;

const useClaimVrtVaultReward = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useMutation(
    FunctionKey.CLAIM_VRT_VAULT_REWARD,
    (params: Omit<IClaimVrtVaultRewardInput, 'vrtVaultContract'>) =>
      claimVrtVaultReward({
        vrtVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useClaimVrtVaultReward;
