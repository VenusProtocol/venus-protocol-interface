import BigNumber from 'bignumber.js';
import { PoolLens, Prime, VaiVault, VenusLens, XvsVault } from 'packages/contracts';
import { Token } from 'types';

import { PendingRewardGroup, XvsVestingVaultPendingRewardGroup } from '../types';
import formatToIsolatedPoolPendingRewardGroup from './formatToIsolatedPoolPendingRewardGroup';
import formatToMainPoolPendingRewardGroup from './formatToMainPoolPendingRewardGroup';
import formatToPrimePendingRewardGroup from './formatToPrimePendingRewardGroup';
import formatToVaultPendingRewardGroup from './formatToVaultPendingRewardGroup';
import formatToVestingVaultPendingRewardGroup from './formatToVestingVaultPendingRewardGroup';

const formatOutput = ({
  tokens,
  mainPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  vaiVaultPendingXvs,
  isolatedPoolsPendingRewards,
  xvsVestingVaultPoolInfos,
  xvsVestingVaultPendingRewards,
  xvsVestingVaultPendingWithdrawalsBeforeUpgrade,
  tokenPriceMapping,
  venusLensPendingRewards,
  primePendingRewards,
  isPrimeContractPaused,
}: {
  tokens: Token[];
  vaiVaultPendingXvs?: Awaited<ReturnType<VaiVault['pendingXVS']>>;
  isolatedPoolsPendingRewards: Array<
    Awaited<ReturnType<PoolLens['getPendingRewards']>> | undefined
  >;
  xvsVestingVaultPoolInfos: Array<Awaited<ReturnType<XvsVault['poolInfos']>> | undefined>;
  xvsVestingVaultPendingRewards: Array<Awaited<ReturnType<XvsVault['pendingReward']>> | undefined>;
  xvsVestingVaultPendingWithdrawalsBeforeUpgrade: Array<
    Awaited<ReturnType<XvsVault['pendingWithdrawalsBeforeUpgrade']>> | undefined
  >;
  tokenPriceMapping: Record<string, BigNumber>;
  isolatedPoolComptrollerAddresses: string[];
  isPrimeContractPaused: boolean;
  venusLensPendingRewards?: Awaited<ReturnType<VenusLens['pendingRewards']>>;
  mainPoolComptrollerContractAddress?: string;
  primePendingRewards?: Awaited<ReturnType<Prime['callStatic']['getPendingRewards']>>;
}): PendingRewardGroup[] => {
  const pendingRewardGroups: PendingRewardGroup[] = [];

  // Extract pending rewards from main pool
  const mainPoolPendingRewardGroup =
    venusLensPendingRewards && mainPoolComptrollerContractAddress
      ? formatToMainPoolPendingRewardGroup({
          venusLensPendingRewards,
          tokenPriceMapping,
          comptrollerContractAddress: mainPoolComptrollerContractAddress,
          tokens,
        })
      : undefined;

  if (mainPoolPendingRewardGroup) {
    pendingRewardGroups.push(mainPoolPendingRewardGroup);
  }

  // Extract pending rewards from isolated pools
  const isolatedPoolPendingRewardGroups = isolatedPoolsPendingRewards.reduce<PendingRewardGroup[]>(
    (acc, rewardSummaries, index) => {
      const isolatedPoolPendingRewardGroup =
        rewardSummaries &&
        formatToIsolatedPoolPendingRewardGroup({
          comptrollerContractAddress: isolatedPoolComptrollerAddresses[index],
          rewardSummaries,
          tokenPriceMapping,
          tokens,
        });

      return isolatedPoolPendingRewardGroup ? [...acc, isolatedPoolPendingRewardGroup] : acc;
    },
    [],
  );
  pendingRewardGroups.push(...isolatedPoolPendingRewardGroups);

  // Extract pending rewards from VAI vault
  const vaiVaultPendingRewardAmountMantissa =
    vaiVaultPendingXvs && new BigNumber(vaiVaultPendingXvs.toString());

  const vaiVaultPendingRewardGroup =
    vaiVaultPendingRewardAmountMantissa &&
    formatToVaultPendingRewardGroup({
      pendingRewardAmountMantissa: vaiVaultPendingRewardAmountMantissa,
      tokenPriceMapping,
      stakedTokenSymbol: 'VAI',
      rewardTokenSymbol: 'XVS',
      tokens,
    });

  if (vaiVaultPendingRewardGroup) {
    pendingRewardGroups.push(vaiVaultPendingRewardGroup);
  }

  // Extract pending rewards from XVS vesting vaults
  const xvsVestingVaultPendingRewardGroups = xvsVestingVaultPendingRewards
    .map((xvsVestingVaultPendingReward, index) => {
      if (!xvsVestingVaultPendingReward) {
        return;
      }

      const vaultPoolInfo = xvsVestingVaultPoolInfos[index];
      const userPendingRewardsAmountMantissa =
        xvsVestingVaultPendingReward && new BigNumber(xvsVestingVaultPendingReward.toString());
      const unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa =
        xvsVestingVaultPendingWithdrawalsBeforeUpgrade[index];
      const userPendingWithdrawalsBeforeUpgradeAmountMantissa =
        unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa &&
        new BigNumber(unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa.toString());

      if (
        !vaultPoolInfo ||
        !userPendingRewardsAmountMantissa ||
        !userPendingWithdrawalsBeforeUpgradeAmountMantissa
      ) {
        return;
      }

      return formatToVestingVaultPendingRewardGroup({
        poolIndex: index,
        userPendingRewardsAmountMantissa,
        userPendingWithdrawalsBeforeUpgradeAmountMantissa,
        tokenPriceMapping,
        tokens,
        stakedTokenAddress: vaultPoolInfo.token,
      });
    })
    .filter((group): group is XvsVestingVaultPendingRewardGroup => !!group);

  pendingRewardGroups.push(...xvsVestingVaultPendingRewardGroups);

  // Extract pending rewards from Prime
  if (primePendingRewards) {
    const primePendingRewardGroup = formatToPrimePendingRewardGroup({
      isPrimeContractPaused,
      primePendingRewards,
      tokenPriceMapping,
      tokens,
    });

    pendingRewardGroups.push(primePendingRewardGroup);
  }

  return pendingRewardGroups;
};

export default formatOutput;
