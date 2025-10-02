import { useMemo } from 'react';

import { type Claim, useGetPendingRewards, useGetPools } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { ExternalRewardsGroup, Group, InternalRewardsGroup } from './types';

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
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  // Format pending rewards into groups
  const internalRewards =
    getPendingRewardsData?.pendingRewardGroups.filter(g => g.type !== 'external') || [];
  const externalRewards =
    getPendingRewardsData?.pendingRewardGroups.filter(g => g.type === 'external') || [];
  const internalRewardsGroups = useMemo(
    () =>
      internalRewards.reduce<InternalRewardsGroup[]>((acc, pendingRewardGroup) => {
        // Vaults
        if (pendingRewardGroup.type === 'vault' || pendingRewardGroup.type === 'xvsVestingVault') {
          const id =
            pendingRewardGroup.type === 'vault'
              ? `vault-${pendingRewardGroup.stakedToken.address}-${pendingRewardGroup.rewardToken.address}`
              : `xvs-vesting-vault-${pendingRewardGroup.rewardToken.iconSrc}-${pendingRewardGroup.poolIndex}`;

          const name =
            pendingRewardGroup.type === 'vault'
              ? t('claimReward.modal.vaultGroup.name', {
                  stakedTokenSymbol: pendingRewardGroup.stakedToken.symbol,
                })
              : t('claimReward.modal.vestingVaultGroup.name', {
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
            isChecked: !uncheckedGroupIds.includes(id) && !pendingRewardGroup.isDisabled,
            isDisabled: pendingRewardGroup.isDisabled,
            warningMessage: pendingRewardGroup.isDisabled
              ? t('claimReward.modal.vaultGroup.disabledContractWarningMessage')
              : undefined,
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

          const group: InternalRewardsGroup = {
            id,
            isChecked: !uncheckedGroupIds.includes(id) && !pendingRewardGroup.isDisabled,
            name: t('claimReward.modal.primeGroup.name'),
            isDisabled: pendingRewardGroup.isDisabled,
            pendingRewards: pendingRewardGroup.pendingRewards,
            warningMessage: pendingRewardGroup.isDisabled
              ? t('claimReward.modal.primeGroup.disabledContractWarningMessage')
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

        const group: InternalRewardsGroup = {
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
      }, []),
    [internalRewards, uncheckedGroupIds, getPoolsData?.pools, xvs, t],
  );

  const externalRewardsGroups = useMemo(
    () =>
      externalRewards.reduce<ExternalRewardsGroup[]>((acc, pendingRewardGroup) => {
        const id = `external-${pendingRewardGroup.campaignName}`;

        const group: ExternalRewardsGroup = {
          id,
          name: pendingRewardGroup.campaignName,
          ...pendingRewardGroup,
        };

        return [...acc, group];
      }, []),
    [externalRewards],
  );

  return { internalRewardsGroups, externalRewardsGroups };
};

export default useGetGroups;
