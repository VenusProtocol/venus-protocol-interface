import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { ClaimRewardsInput, ClaimRewardsOutput, claimRewards, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

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
    name: 'multicall3',
    passSigner: true,
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

  const { captureAnalyticEvent } = useAnalytics();

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
        variables.claims.forEach(claim => {
          if (claim.contract === 'mainPoolComptroller') {
            captureAnalyticEvent('Pool reward claimed', {
              comptrollerAddress: mainPoolComptrollerContractAddress!,
              vTokenAddressesWithPendingReward: claim.vTokenAddressesWithPendingReward,
            });
          } else if (claim.contract === 'rewardsDistributor') {
            captureAnalyticEvent('Pool reward claimed', {
              comptrollerAddress: claim.comptrollerContractAddress,
              vTokenAddressesWithPendingReward: claim.vTokenAddressesWithPendingReward,
            });
          } else if (claim.contract === 'vaiVault') {
            captureAnalyticEvent('VAI vault reward claimed', undefined);
          } else if (claim.contract === 'xvsVestingVault') {
            captureAnalyticEvent('XVS vesting vault reward claimed', {
              poolIndex: claim.poolIndex,
              rewardTokenSymbol: claim.rewardToken.symbol,
            });
          }
        });

        queryClient.invalidateQueries([FunctionKey.GET_PENDING_REWARDS, variables.accountAddress]);
      },
    },
  );
};

export default useClaimRewards;
