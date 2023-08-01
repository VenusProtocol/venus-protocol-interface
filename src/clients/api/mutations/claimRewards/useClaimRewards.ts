import { VError } from 'errors';
import { MutationObserverOptions, useMutation } from 'react-query';

import { ClaimRewardsInput, ClaimRewardsOutput, claimRewards, queryClient } from 'clients/api';
import { useGetUniqueContract, useGetUniqueContractAddress } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

type HandleClaimRewardsInput = Omit<
  ClaimRewardsInput,
  | 'multicallContract'
  | 'mainPoolComptrollerContractAddress'
  | 'vaiVaultContractAddress'
  | 'xvsVaultContractAddress'
>;

type Options = MutationObserverOptions<ClaimRewardsOutput, Error, HandleClaimRewardsInput>;

const useClaimRewards = (options?: Options) => {
  const multicallContract = useGetUniqueContract({
    name: 'multicall',
  });

  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

  const vaiVaultContractAddress = useGetUniqueContractAddress({
    name: 'vaiVault',
  });

  const xvsVaultContractAddress = useGetUniqueContractAddress({
    name: 'xvsVault',
  });

  const handleClaimRewards = (input: HandleClaimRewardsInput) => {
    if (
      !multicallContract ||
      !mainPoolComptrollerContractAddress ||
      !vaiVaultContractAddress ||
      !xvsVaultContractAddress
    ) {
      logError('Contract infos missing for claimRewards mutation function call');
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return claimRewards({
      multicallContract,
      mainPoolComptrollerContractAddress,
      vaiVaultContractAddress,
      xvsVaultContractAddress,
      ...input,
    });
  };

  return useMutation(FunctionKey.CLAIM_REWARDS, handleClaimRewards, {
    ...options,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([FunctionKey.GET_PENDING_REWARDS, variables.accountAddress]);
    },
  });
};

export default useClaimRewards;
