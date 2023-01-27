import { MutationObserverOptions, useMutation } from 'react-query';

import { ClaimVaiVaultRewardOutput, claimVaiVaultReward, queryClient } from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<ClaimVaiVaultRewardOutput, Error>;

const useClaimVaiVaultReward = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.CLAIM_VAI_VAULT_REWARD,
    () =>
      claimVaiVaultReward({
        vaiVaultContract,
      }),
    {
      ...options,
      onSuccess: () => {
        queryClient.invalidateQueries(FunctionKey.GET_VAI_VAULT_PENDING_XVS);
      },
    },
  );
};

export default useClaimVaiVaultReward;
