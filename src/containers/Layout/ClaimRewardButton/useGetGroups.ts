import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { useMemo } from 'react';

import { Claim, useGetPendingRewards, useGetPools } from 'clients/api';

import { Group } from './types';

const useGetGroups = ({ uncheckedGroupIds }: { uncheckedGroupIds: string[] }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: getPoolsData } = useGetPools({
    accountAddress,
  });

  const xvs = useGetToken({
    symbol: 'XVS',
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
                    stakedTokenSymbol: xvs?.symbol,
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
                  rewardAmountMantissa: pendingRewardGroup.rewardAmountMantissa,
                  rewardAmountCents: pendingRewardGroup.rewardAmountCents,
                },
              ],
              claims: [claim],
            };

            return [...acc, group];
          }

          // Prime
          if (pendingRewardGroup.type === 'prime') {
            const id = 'prime';

            const group: Group = {
              id,
              name: t('layout.claimRewardModal.primeGroup.name'),
              isChecked: !uncheckedGroupIds.includes(id) && !pendingRewardGroup.isDisabled,
              pendingRewards: pendingRewardGroup.pendingRewards,
              isDisabled: pendingRewardGroup.isDisabled,
              warningMessage: pendingRewardGroup.isDisabled
                ? t('layout.claimRewardModal.primeGroup.disabledContractWarningMessage')
                : undefined,
              claims: [
                {
                  contract: 'prime',
                  vTokenAddressesWithPendingReward:
                    pendingRewardGroup.vTokenAddressesWithPendingReward,
                },
              ],
            };

            return [...acc, group];
          }

          const pool = (getPoolsData?.pools || []).find(
            item =>
              item.comptrollerAddress.toLowerCase() ===
              pendingRewardGroup.comptrollerAddress.toLowerCase(),
          );

          if (!pool) {
            return acc;
          }

          // Core pool
          if (pendingRewardGroup.type === 'legacyPool') {
            const id = 'main-pool';

            const group: Group = {
              id,
              name: pool.name,
              isChecked: !uncheckedGroupIds.includes(id),
              pendingRewards: [
                {
                  rewardToken: pendingRewardGroup.rewardToken,
                  rewardAmountMantissa: pendingRewardGroup.rewardAmountMantissa,
                  rewardAmountCents: pendingRewardGroup.rewardAmountCents,
                },
              ],
              claims: [
                {
                  contract: 'legacyPoolComptroller',
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
              rewardAmountMantissa: pendingReward.rewardAmountMantissa,
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
    [getPendingRewardsData?.pendingRewardGroups, uncheckedGroupIds, getPoolsData?.pools, xvs, t],
  );
};

export default useGetGroups;
