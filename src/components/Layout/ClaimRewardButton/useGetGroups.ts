import { useMemo } from 'react';
import { useTranslation } from 'translation';
import { areTokensEqual, getContractAddress } from 'utilities';

import { Claim, useGetPendingRewards, useGetPools, useGetXvsVaultPoolCount } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import { Group } from './types';

const mainPoolComptrollerAddress = getContractAddress('comptroller');

const useGetGroups = ({ uncheckedGroupNames }: { uncheckedGroupNames: string[] }) => {
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
              name,
              isChecked: !uncheckedGroupNames.includes(name),
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

          const name = t('layout.claimRewardModal.poolGroup', { poolName: pool.name });

          const claims: Claim[] =
            pendingRewardGroup.type === 'mainPool'
              ? [
                  {
                    contract: 'mainPoolComptroller',
                    vTokenAddressesWithPendingReward: pendingRewardGroup.pendingRewards.map(
                      pendingReward => pendingReward.rewardToken.address,
                    ),
                  },
                ]
              : pendingRewardGroup.pendingRewards.map(pendingReward => ({
                  contract: 'rewardsDistributor',
                  contractAddress: pendingReward.rewardsDistributorAddress,
                  vTokenAddressesWithPendingReward: pendingReward.vTokenAddressesWithPendingReward,
                }));

          const group: Group = {
            name: t('layout.claimRewardModal.poolGroup', { poolName: pool.name }),
            isChecked: !uncheckedGroupNames.includes(name),
            pendingRewards: pendingRewardGroup.pendingRewards.map(pendingReward => ({
              rewardToken: pendingReward.rewardToken,
              rewardAmountWei: pendingReward.rewardAmountWei,
            })),
            claims,
          };

          return [...acc, group];
        },
        [],
      ),
    [getPendingRewardsData?.pendingRewardGroups, uncheckedGroupNames, getPoolsData?.pools],
  );
};

export default useGetGroups;
