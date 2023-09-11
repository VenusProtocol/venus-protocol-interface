import { useMemo } from 'react';
import { useTranslation } from 'translation';

import { Claim, useGetPendingRewards, useGetPools } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import { Group } from './types';

const useGetGroups = ({ uncheckedGroupIds }: { uncheckedGroupIds: string[] }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const { data: getPoolsData } = useGetPools({
    accountAddress,
  });

  const { data: getPendingRewardsData } = useGetPendingRewards(
    {
      accountAddress: accountAddress || '',
    },
    {
      enabled: !!accountAddress,
    },
  );

  // Format pending rewards into groups
  return useMemo(
    () =>
      (getPendingRewardsData?.pendingRewardGroups || []).reduce<Group[]>(
        (acc, pendingRewardGroup) => {
          // Vaults
          if (
            pendingRewardGroup.type === 'vault' ||
            pendingRewardGroup.type === 'xvsVestingVault'
          ) {
            const id =
              pendingRewardGroup.type === 'vault'
                ? `vault-${pendingRewardGroup.stakedToken.address}-${pendingRewardGroup.rewardToken.address}`
                : `xvs-vesting-vault-${pendingRewardGroup.rewardToken.asset}-${pendingRewardGroup.poolIndex}`;

            const name =
              pendingRewardGroup.type === 'vault'
                ? t('layout.claimRewardModal.vaultGroup', {
                    stakedTokenSymbol: pendingRewardGroup.stakedToken.symbol,
                  })
                : t('layout.claimRewardModal.vestingVaultGroup', {
                    stakedTokenSymbol: TOKENS.xvs.symbol,
                  });

            const claim: Claim =
              pendingRewardGroup.type === 'vault'
                ? {
                    contract: 'vaiVault',
                  }
                : {
                    contract: 'xvsVestingVault',
                    rewardToken: pendingRewardGroup.rewardToken,
                    poolIndex: pendingRewardGroup.poolIndex,
                  };

            const group: Group = {
              id,
              name,
              isChecked: !uncheckedGroupIds.includes(id),
              pendingRewards: [
                {
                  rewardToken: pendingRewardGroup.rewardToken,
                  rewardAmountWei: pendingRewardGroup.rewardAmountWei,
                  rewardAmountCents: pendingRewardGroup.rewardAmountCents,
                },
              ],
              claims: [claim],
            };

            return [...acc, group];
          }

          // Pools
          if (
            pendingRewardGroup.type !== 'mainPool' &&
            pendingRewardGroup.type !== 'isolatedPool'
          ) {
            return acc;
          }

          const pool = (getPoolsData?.pools || []).find(
            item =>
              item.comptrollerAddress.toLowerCase() ===
              pendingRewardGroup.comptrollerAddress.toLowerCase(),
          );

          if (!pool) {
            return acc;
          }

          // Main pool
          if (pendingRewardGroup.type === 'mainPool') {
            const id = 'main-pool';

            const group: Group = {
              id,
              name: pool.name,
              isChecked: !uncheckedGroupIds.includes(id),
              pendingRewards: [
                {
                  rewardToken: pendingRewardGroup.rewardToken,
                  rewardAmountWei: pendingRewardGroup.rewardAmountWei,
                  rewardAmountCents: pendingRewardGroup.rewardAmountCents,
                },
              ],
              claims: [
                {
                  contract: 'mainPoolComptroller',
                  vTokenAddressesWithPendingReward:
                    pendingRewardGroup.vTokenAddressesWithPendingReward,
                },
              ],
            };

            return [...acc, group];
          }

          // Isolated pools
          const id = `isolated-pool-${pendingRewardGroup.comptrollerAddress}`;

          const group: Group = {
            id,
            name: pool.name,
            isChecked: !uncheckedGroupIds.includes(id),
            pendingRewards: pendingRewardGroup.pendingRewards.map(pendingReward => ({
              rewardToken: pendingReward.rewardToken,
              rewardAmountWei: pendingReward.rewardAmountWei,
              rewardAmountCents: pendingReward.rewardAmountCents,
            })),
            claims: pendingRewardGroup.pendingRewards.map(pendingReward => ({
              contract: 'rewardsDistributor',
              contractAddress: pendingReward.rewardsDistributorAddress,
              comptrollerContractAddress: pendingRewardGroup.comptrollerAddress,
              vTokenAddressesWithPendingReward: pendingReward.vTokenAddressesWithPendingReward,
            })),
          };

          return [...acc, group];
        },
        [],
      ),
    [getPendingRewardsData?.pendingRewardGroups, uncheckedGroupIds, getPoolsData?.pools],
  );
};

export default useGetGroups;
