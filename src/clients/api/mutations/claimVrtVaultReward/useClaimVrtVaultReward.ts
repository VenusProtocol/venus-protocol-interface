import { MutationObserverOptions, useMutation } from 'react-query';

import { ClaimVrtVaultRewardOutput, claimVrtVaultReward, queryClient } from 'clients/api';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<ClaimVrtVaultRewardOutput, Error>;

const useClaimVrtVaultReward = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useMutation(
    FunctionKey.CLAIM_VRT_VAULT_REWARD,
    () =>
      claimVrtVaultReward({
        vrtVaultContract,
      }),
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries(FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST);
      },
    },
  );
};

export default useClaimVrtVaultReward;
