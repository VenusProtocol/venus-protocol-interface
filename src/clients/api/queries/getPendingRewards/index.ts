import BigNumber from 'bignumber.js';
import { logError } from 'errors';

import { VError } from 'errors/VError';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import findTokenByAddress from 'utilities/findTokenByAddress';
import removeDuplicates from 'utilities/removeDuplicates';

import formatOutput from './formatOutput';
import { GetPendingRewardsInput, GetPendingRewardsOutput } from './types';

const getPendingRewards = async ({
  tokens,
  mainPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  accountAddress,
  venusLensContract,
  resilientOracleContract,
  poolLensContract,
  vaiVaultContract,
  xvsVaultContract,
  primeContract,
}: GetPendingRewardsInput): Promise<GetPendingRewardsOutput> => {
  const xvsTokenAddress = tokens.find(token => token.symbol === 'XVS')?.address;

  if (!xvsTokenAddress) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

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

  const primePromises = Promise.allSettled([
    primeContract?.callStatic.getPendingRewards(accountAddress),
  ]);

  const [vaiVaultPendingXvsResult, venusLensPendingRewardsResult] = await vaiVaultVenusLensPromises;
  const isolatedPoolsPendingRewardsResults = await isolatedPoolsPendingRewardsPromises;
  const xvsVestingVaultPoolInfosResults = await xvsVestingVaultPoolInfosSettledPromises;
  const xvsVestingVaultPendingRewardResults = await xvsVestingVaultPendingRewardSettledPromises;
  const xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults =
    await xvsVestingVaultPendingWithdrawalsBeforeUpgradeSettledPromises;
  const [primePendingRewardsResults] = await primePromises;

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

  const primePendingRewards = extractSettledPromiseValue(primePendingRewardsResults) || [];
  const primeRewardTokenAddresses = primePendingRewards.map(
    primePendingReward => primePendingReward.rewardToken,
  );

  const rewardTokenAddresses = removeDuplicates([
    xvsTokenAddress,
    ...isolatedPoolRewardTokenAddresses,
    ...primeRewardTokenAddresses,
  ]);
  const rewardTokenPricesPromises = Promise.allSettled(
    rewardTokenAddresses.map(rewardTokenAddress =>
      resilientOracleContract.getPrice(rewardTokenAddress),
    ),
  );

  const rewardTokenPricesResults = await rewardTokenPricesPromises;

  const tokenPriceMapping: Record<string, BigNumber> = rewardTokenPricesResults.reduce<{
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
      [rewardTokenAddress.toLowerCase()]: rewardTokenPriceDollars,
    };
  }, {});

  const pendingRewardGroups = formatOutput({
    tokens,
    mainPoolComptrollerContractAddress,
    isolatedPoolComptrollerAddresses,
    vaiVaultPendingXvs: extractSettledPromiseValue(vaiVaultPendingXvsResult),
    venusLensPendingRewards: extractSettledPromiseValue(venusLensPendingRewardsResult),
    isolatedPoolsPendingRewards: isolatedPoolsPendingRewardsResults.map(extractSettledPromiseValue),
    xvsVestingVaultPoolInfos: xvsVestingVaultPoolInfosResults.map(extractSettledPromiseValue),
    xvsVestingVaultPendingRewards: xvsVestingVaultPendingRewardResults.map(
      extractSettledPromiseValue,
    ),
    xvsVestingVaultPendingWithdrawalsBeforeUpgrade:
      xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults.map(extractSettledPromiseValue),
    tokenPriceMapping,
    primePendingRewards,
  });

  return {
    pendingRewardGroups,
  };
};

export default getPendingRewards;
