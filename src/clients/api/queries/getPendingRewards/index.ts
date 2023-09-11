// import findTokenByAddress from 'utilities/findTokenByAddress';
// import formatOutput from './formatOutput';
import BigNumber from 'bignumber.js';

import { logError } from 'context/ErrorLogger';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import findTokenByAddress from 'utilities/findTokenByAddress';

import { GetPendingRewardGroupsInput, GetPendingRewardGroupsOutput } from './types';

const getPendingRewardGroups = async ({
  tokens,
  xvsTokenAddress,
  mainPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  accountAddress,
  venusLensContract,
  resilientOracleContract,
  poolLensContract,
  vaiVaultContract,
  xvsVaultContract,
}: GetPendingRewardGroupsInput): Promise<GetPendingRewardGroupsOutput> => {
  const vaiVaultVenusLensPromises = Promise.allSettled([
    vaiVaultContract.pendingXVS(accountAddress),
    venusLensContract && !!mainPoolComptrollerContractAddress
      ? venusLensContract.pendingRewards(accountAddress, mainPoolComptrollerContractAddress)
      : undefined,
  ]);

  const isolatedPoolsPendingRewardsPromises = Promise.allSettled(
    isolatedPoolComptrollerAddresses.map(isolatedPoolComptrollerAddress =>
      poolLensContract.getPendingRewards(accountAddress, isolatedPoolComptrollerAddress),
    ),
  );

  const xvsVestingVaultPoolInfosPromises: ReturnType<(typeof xvsVaultContract)['poolInfos']>[] = [];
  const xvsVestingVaultPendingRewardPromises: ReturnType<
    (typeof xvsVaultContract)['pendingReward']
  >[] = [];
  const xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises: ReturnType<
    (typeof xvsVaultContract)['pendingWithdrawalsBeforeUpgrade']
  >[] = [];

  for (let poolIndex = 0; poolIndex < xvsVestingVaultPoolCount; poolIndex++) {
    xvsVestingVaultPoolInfosPromises.push(xvsVaultContract.poolInfos(xvsTokenAddress, poolIndex));
    xvsVestingVaultPendingRewardPromises.push(
      xvsVaultContract.pendingReward(xvsTokenAddress, poolIndex, accountAddress),
    );
    xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises.push(
      xvsVaultContract.pendingWithdrawalsBeforeUpgrade(xvsTokenAddress, poolIndex, accountAddress),
    );
  }

  const xvsVestingVaultPoolInfosSettledPromises = Promise.allSettled(
    xvsVestingVaultPoolInfosPromises,
  );
  const xvsVestingVaultPendingRewardSettledPromises = Promise.allSettled(
    xvsVestingVaultPendingRewardPromises,
  );
  const xvsVestingVaultPendingWithdrawalsBeforeUpgradeSettledPromises = Promise.allSettled(
    xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises,
  );

  const [vaiVaultPendingXvsResult, venusLensPendingRewardsResult] = await vaiVaultVenusLensPromises;
  const isolatedPoolsPendingRewardsResults = await isolatedPoolsPendingRewardsPromises;
  const xvsVestingVaultPoolInfosResults = await xvsVestingVaultPoolInfosSettledPromises;
  const xvsVestingVaultPendingRewardResults = await xvsVestingVaultPendingRewardSettledPromises;
  const xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults =
    await xvsVestingVaultPendingWithdrawalsBeforeUpgradeSettledPromises;

  const isolatedPoolRewardTokenAddresses = isolatedPoolsPendingRewardsResults.reduce<string[]>(
    (acc, isolatedPoolsPendingRewardsResult) => {
      if (isolatedPoolsPendingRewardsResult.status === 'rejected') {
        return acc;
      }

      const rewardTokenAddresses = isolatedPoolsPendingRewardsResult.value.map(
        rewardSummary => rewardSummary.rewardTokenAddress,
      );

      return [...acc, ...rewardTokenAddresses];
    },
    [],
  );

  const rewardTokenAddresses = [...new Set([xvsTokenAddress, ...isolatedPoolRewardTokenAddresses])];
  const rewardTokenPricesResults = await Promise.allSettled(
    rewardTokenAddresses.map(rewardTokenAddress =>
      resilientOracleContract.getPrice(rewardTokenAddress),
    ),
  );

  const rewardTokenPrices = rewardTokenPricesResults.reduce<{
    [address: string]: BigNumber;
  }>((acc, rewardTokenPricesResult, index) => {
    const rewardTokenAddress = rewardTokenAddresses[index];
    const rewardToken = findTokenByAddress({
      tokens,
      address: rewardTokenAddress,
    });

    if (!rewardToken) {
      logError(`Record missing for reward token: ${rewardTokenAddress}`);
      return acc;
    }

    if (rewardTokenPricesResult.status === 'rejected') {
      return acc;
    }

    const rewardTokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: new BigNumber(rewardTokenPricesResult.value.toString()),
      token: rewardToken,
    });

    return {
      ...acc,
      [rewardTokenAddress]: rewardTokenPriceDollars,
    };
  }, {});

  return {
    pendingRewardGroups: [],
  };
};

export default getPendingRewardGroups;
