import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { areTokensEqual, getContractAddress } from 'utilities';

import { Claim, useGetPendingRewards, useGetPools, useGetXvsVaultPoolCount } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import { Group } from './types';

const mainPoolComptrollerAddress = getContractAddress('comptroller');

const useGetGroups = ({ uncheckedGroupIds }: { uncheckedGroupIds: string[] }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  // Get XVS vesting vault pool count
  const { data: getXvsVaultPoolCountData, isLoading: isGetXvsVaultPoolCountLoading } =
    useGetXvsVaultPoolCount();

  // Get Comptroller addresses of isolated pools
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const isolatedPoolComptrollerAddresses = useMemo(
    () =>
      (getPoolsData?.pools || []).reduce<string[]>(
        (acc, pool) => (pool.isIsolated ? [...acc, pool.comptrollerAddress] : acc),
        [],
      ),
    [getPoolsData?.pools],
  );

  const { data: getPendingRewardsData } = useGetPendingRewards(
    {
      accountAddress: accountAddress || '',
      mainPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses,
      xvsVestingVaultPoolCount: getXvsVaultPoolCountData?.poolCount || 0,
    },
    {
      enabled: !!accountAddress && !isGetPoolsLoading && !isGetXvsVaultPoolCountLoading,
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
                    contract: areTokensEqual(pendingRewardGroup.stakedToken, TOKENS.vai)
                      ? 'vaiVault'
                      : 'vrtVault',
                  }
                : {
                    contract: 'xvsVestingVault',
                    rewardTokenAddress: pendingRewardGroup.rewardToken.address,
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
              name: t('layout.claimRewardModal.poolGroup', { poolName: pool.name }),
              isChecked: !uncheckedGroupIds.includes(id),
              pendingRewards: [
                {
                  rewardToken: pendingRewardGroup.rewardToken,
                  rewardAmountWei: pendingRewardGroup.rewardAmountWei,
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
            name: t('layout.claimRewardModal.poolGroup', { poolName: pool.name }),
            isChecked: !uncheckedGroupIds.includes(id),
            pendingRewards: pendingRewardGroup.pendingRewards.map(pendingReward => ({
              rewardToken: pendingReward.rewardToken,
              rewardAmountWei: pendingReward.rewardAmountWei,
            })),
            claims: pendingRewardGroup.pendingRewards.map(pendingReward => ({
              contract: 'rewardsDistributor',
              contractAddress: pendingReward.rewardsDistributorAddress,
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
