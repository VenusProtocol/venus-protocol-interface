import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { ClaimRewardsInput, ClaimRewardsOutput, claimRewards, queryClient } from 'clients/api';
import { useGetUniqueContract, useGetUniqueContractAddress } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedClaimRewardsInput = Omit<
  ClaimRewardsInput,
  | 'multicallContract'
  | 'mainPoolComptrollerContractAddress'
  | 'vaiVaultContractAddress'
  | 'xvsVaultContractAddress'
>;

type Options = MutationObserverOptions<ClaimRewardsOutput, Error, TrimmedClaimRewardsInput>;

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

  return useMutation(
    FunctionKey.CLAIM_REWARDS,
    (input: TrimmedClaimRewardsInput) =>
      callOrThrow(
        {
          multicallContract,
          mainPoolComptrollerContractAddress,
          vaiVaultContractAddress,
          xvsVaultContractAddress,
        },
        params =>
          claimRewards({
            ...params,
            ...input,
          }),
      ),
    {
      ...options,
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries([FunctionKey.GET_PENDING_REWARDS, variables.accountAddress]);
      },
    },
  );
};

export default useClaimRewards;
