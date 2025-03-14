import type BigNumber from 'bignumber.js';

import { VError, logError } from 'libs/errors';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import findTokenByAddress from 'utilities/findTokenByAddress';
import removeDuplicates from 'utilities/removeDuplicates';

import { getApiTokenPrice } from 'clients/api';
import formatOutput from './formatOutput';
import getMerklUserRewards from './getMerklRewards';
import type {
  GetPendingRewardsInput,
  GetPendingRewardsOutput,
  PendingExternalRewardSummary,
} from './types';

const getPendingRewards = async ({
  tokens,
  legacyPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  accountAddress,
  venusLensContract,
  poolLensContract,
  vaiVaultContract,
  xvsVaultContract,
  primeContract,
  chainId,
  merklCampaigns,
}: GetPendingRewardsInput): Promise<GetPendingRewardsOutput> => {
  const xvsTokenAddress = tokens.find(token => token.symbol === 'XVS')?.address;

  if (!xvsTokenAddress) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  const vaiVaultVenusLensPromises = Promise.allSettled([
    vaiVaultContract ? vaiVaultContract.pendingXVS(accountAddress) : undefined,
    vaiVaultContract ? vaiVaultContract.vaultPaused() : undefined,
    venusLensContract && !!legacyPoolComptrollerContractAddress
      ? venusLensContract.pendingRewards(accountAddress, legacyPoolComptrollerContractAddress)
      : undefined,
  ]);

  const isolatedPoolsPendingRewardsPromises = Promise.allSettled(
    isolatedPoolComptrollerAddresses.map(isolatedPoolComptrollerAddress =>
      poolLensContract.getPendingRewards(accountAddress, isolatedPoolComptrollerAddress),
    ),
  );

  const xvsVestingVaultPausedPromise = xvsVaultContract.vaultPaused();
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
    primeContract?.paused(),
    primeContract?.callStatic.getPendingRewards(accountAddress),
  ]);

  // only reach out for Merkl reward details if there campaigns
  const hasMerklCampaigns = Object.keys(merklCampaigns).length > 0;
  let merklPendingRewards: PendingExternalRewardSummary[] = [];
  if (hasMerklCampaigns) {
    const [merklApiResponseSettled] = await Promise.allSettled([
      getMerklUserRewards({
        merklCampaigns,
        chainId,
        accountAddress,
      }),
    ]);

    if (merklApiResponseSettled.status === 'rejected') {
      logError(merklApiResponseSettled.reason);
    } else {
      merklPendingRewards = merklApiResponseSettled.value;
    }
  }

  const [vaiVaultPendingXvsResult, vaiVaultPausedResult, venusLensPendingRewardsResult] =
    await vaiVaultVenusLensPromises;
  const isolatedPoolsPendingRewardsResults = await isolatedPoolsPendingRewardsPromises;
  const xvsVestingVaultPausedResult = await xvsVestingVaultPausedPromise;
  const xvsVestingVaultPoolInfosResults = await xvsVestingVaultPoolInfosSettledPromises;
  const xvsVestingVaultPendingRewardResults = await xvsVestingVaultPendingRewardSettledPromises;
  const xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults =
    await xvsVestingVaultPendingWithdrawalsBeforeUpgradeSettledPromises;
  const [isPrimeContractPausedResult, primePendingRewardsResults] = await primePromises;

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

  const merklRewardTokenAddresses = merklPendingRewards
    ? merklPendingRewards.map(r => r.rewardTokenAddress)
    : [];

  const rewardTokenAddresses = removeDuplicates([
    xvsTokenAddress,
    ...isolatedPoolRewardTokenAddresses,
    ...primeRewardTokenAddresses,
    ...merklRewardTokenAddresses,
  ]);
  const tokenPriceMantissaMapping = await getApiTokenPrice({
    tokenAddresses: rewardTokenAddresses,
    chainId,
  });

  const tokenPriceMapping: Record<string, BigNumber> = Object.entries(
    tokenPriceMantissaMapping,
  ).reduce<{
    [address: string]: BigNumber;
  }>((acc, tokenPriceMantissaTuple) => {
    const rewardTokenAddress = tokenPriceMantissaTuple[0];
    const rewardTokenPriceMantissa = tokenPriceMantissaTuple[1];
    const rewardToken = findTokenByAddress({
      tokens,
      address: rewardTokenAddress,
    });

    if (!rewardToken) {
      return acc;
    }

    const rewardTokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: rewardTokenPriceMantissa,
      decimals: rewardToken.decimals,
    });

    return {
      ...acc,
      [rewardTokenAddress.toLowerCase()]: rewardTokenPriceDollars,
    };
  }, {});

  const pendingRewardGroups = formatOutput({
    tokens,
    legacyPoolComptrollerContractAddress,
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
    isVaiVaultContractPaused: extractSettledPromiseValue(vaiVaultPausedResult) ?? false,
    isXvsVestingVaultContractPaused: xvsVestingVaultPausedResult,
    isPrimeContractPaused: extractSettledPromiseValue(isPrimeContractPausedResult) ?? false,
    merklPendingRewards,
  });

  return {
    pendingRewardGroups,
  };
};

export default getPendingRewards;
