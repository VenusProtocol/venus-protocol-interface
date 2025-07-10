import type BigNumber from 'bignumber.js';
import { poolLensAbi, primeAbi, vaiVaultAbi, venusLensAbi, xvsVaultAbi } from 'libs/contracts';
import { VError, logError } from 'libs/errors';
import convertPriceMantissaToDollars from 'utilities/convertPriceMantissaToDollars';
import extractSettledPromiseValue from 'utilities/extractSettledPromiseValue';
import findTokenByAddress from 'utilities/findTokenByAddress';
import removeDuplicates from 'utilities/removeDuplicates';
import type { ContractFunctionArgs, ReadContractReturnType } from 'viem';
import formatOutput from './formatOutput';
import { getApiTokenPrice } from './getApiTokenPrice';
import { getMerklUserRewards } from './getMerklUserRewards';
import type {
  GetPendingRewardsInput,
  GetPendingRewardsOutput,
  PendingExternalRewardSummary,
} from './types';

export const getPendingRewards = async ({
  tokens,
  publicClient,
  legacyPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  accountAddress,
  venusLensContractAddress,
  poolLensContractAddress,
  vaiVaultContractAddress,
  xvsVaultContractAddress,
  primeContractAddress,
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
    vaiVaultContractAddress
      ? publicClient.readContract({
          abi: vaiVaultAbi,
          address: vaiVaultContractAddress,
          functionName: 'pendingXVS',
          args: [accountAddress],
        })
      : undefined,
    vaiVaultContractAddress
      ? publicClient.readContract({
          abi: vaiVaultAbi,
          address: vaiVaultContractAddress,
          functionName: 'vaultPaused',
        })
      : undefined,
    venusLensContractAddress && !!legacyPoolComptrollerContractAddress
      ? publicClient.readContract({
          abi: venusLensAbi,
          address: venusLensContractAddress,
          functionName: 'pendingRewards',
          args: [accountAddress, legacyPoolComptrollerContractAddress],
        })
      : undefined,
  ]);

  const isolatedPoolsPendingRewardsPromises = Promise.allSettled(
    isolatedPoolComptrollerAddresses.map(isolatedPoolComptrollerAddress =>
      publicClient.readContract({
        abi: poolLensAbi,
        address: poolLensContractAddress,
        functionName: 'getPendingRewards',
        args: [accountAddress, isolatedPoolComptrollerAddress],
      }),
    ),
  );

  const xvsVestingVaultPausedPromise = publicClient.readContract({
    abi: xvsVaultAbi,
    address: xvsVaultContractAddress,
    functionName: 'vaultPaused',
  });

  const {
    xvsVestingVaultPoolInfosPromises,
    xvsVestingVaultPendingRewardPromises,
    xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises,
  } = new Array(xvsVestingVaultPoolCount).fill(undefined).reduce<{
    xvsVestingVaultPoolInfosPromises: Promise<
      ReadContractReturnType<
        typeof xvsVaultAbi,
        'poolInfos',
        ContractFunctionArgs<typeof xvsVaultAbi, 'pure' | 'view', 'poolInfos'>
      >
    >[];
    xvsVestingVaultPendingRewardPromises: Promise<
      ReadContractReturnType<
        typeof xvsVaultAbi,
        'pendingReward',
        ContractFunctionArgs<typeof xvsVaultAbi, 'pure' | 'view', 'pendingReward'>
      >
    >[];
    xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises: Promise<
      ReadContractReturnType<
        typeof xvsVaultAbi,
        'pendingWithdrawalsBeforeUpgrade',
        ContractFunctionArgs<typeof xvsVaultAbi, 'pure' | 'view', 'pendingWithdrawalsBeforeUpgrade'>
      >
    >[];
  }>(
    (acc, _, poolIndex) => ({
      xvsVestingVaultPoolInfosPromises: [
        ...acc.xvsVestingVaultPoolInfosPromises,
        publicClient.readContract({
          abi: xvsVaultAbi,
          address: xvsVaultContractAddress,
          functionName: 'poolInfos',
          args: [xvsTokenAddress, BigInt(poolIndex)],
        }),
      ],
      xvsVestingVaultPendingRewardPromises: [
        ...acc.xvsVestingVaultPendingRewardPromises,
        publicClient.readContract({
          abi: xvsVaultAbi,
          address: xvsVaultContractAddress,
          functionName: 'pendingReward',
          args: [xvsTokenAddress, BigInt(poolIndex), accountAddress],
        }),
      ],
      xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises: [
        ...acc.xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises,
        publicClient.readContract({
          abi: xvsVaultAbi,
          address: xvsVaultContractAddress,
          functionName: 'pendingWithdrawalsBeforeUpgrade',
          args: [xvsTokenAddress, BigInt(poolIndex), accountAddress],
        }),
      ],
    }),
    {
      xvsVestingVaultPoolInfosPromises: [],
      xvsVestingVaultPendingRewardPromises: [],
      xvsVestingVaultPendingWithdrawalsBeforeUpgradePromises: [],
    },
  );

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
    primeContractAddress
      ? publicClient.readContract({
          abi: primeAbi,
          address: primeContractAddress,
          functionName: 'paused',
        })
      : undefined,
    primeContractAddress
      ? publicClient.simulateContract({
          abi: primeAbi,
          address: primeContractAddress,
          functionName: 'getPendingRewards',
          args: [accountAddress],
        })
      : undefined,
  ]);

  // Only fetchMerkl rewards if there are campaigns
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

  const [vaiVaultPendingXvsMantissaResult, vaiVaultPausedResult, venusLensPendingRewardsResult] =
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

  const primePendingRewards = extractSettledPromiseValue(primePendingRewardsResults)?.result || [];
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
    const availableRewardTokenPrices = tokenPriceMantissaTuple[1];
    const referenceRewardTokenPrice =
      availableRewardTokenPrices.find(tokenPrice => tokenPrice.priceSource === 'merkl') ||
      availableRewardTokenPrices.find(tokenPrice => tokenPrice.priceSource === 'oracle') ||
      availableRewardTokenPrices.find(tokenPrice => tokenPrice.priceSource === 'coingecko') ||
      availableRewardTokenPrices.find(tokenPrice => tokenPrice.priceSource === 'merkl');
    const rewardToken = findTokenByAddress({
      tokens,
      address: rewardTokenAddress,
    });

    if (!rewardToken) {
      return acc;
    }

    if (!referenceRewardTokenPrice) {
      return acc;
    }

    const rewardTokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: referenceRewardTokenPrice.priceMantissa,
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
    vaiVaultPendingXvsMantissa: extractSettledPromiseValue(vaiVaultPendingXvsMantissaResult),
    venusLensPendingRewards: extractSettledPromiseValue(venusLensPendingRewardsResult),
    isolatedPoolsPendingRewards:
      isolatedPoolsPendingRewardsResults.map(extractSettledPromiseValue) || [],
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
