import BigNumber from 'bignumber.js';

import type { Token } from 'types';

import type { poolLensAbi, primeAbi, venusLensAbi, xvsVaultAbi } from 'libs/contracts';
import type {
  Address,
  ContractFunctionArgs,
  ReadContractReturnType,
  SimulateContractReturnType,
} from 'viem';
import type {
  PendingExternalRewardSummary,
  PendingInternalRewardSummary,
  PendingRewardGroup,
  PrimePendingRewardGroup,
  XvsVestingVaultPendingRewardGroup,
} from '../types';
import formatToExternalPendingRewardGroup from './formatToExternalPendingRewardGroup';
import formatToIsolatedPoolPendingRewardGroup from './formatToIsolatedPoolPendingRewardGroup';
import formatToLegacyPoolPendingRewardGroup from './formatToLegacyPoolPendingRewardGroup';
import formatToPrimePendingRewardGroup from './formatToPrimePendingRewardGroup';
import formatToVaultPendingRewardGroup from './formatToVaultPendingRewardGroup';
import formatToVestingVaultPendingRewardGroup from './formatToVestingVaultPendingRewardGroup';

const formatOutput = ({
  tokens,
  legacyPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  vaiVaultPendingXvsMantissa,
  isolatedPoolsPendingRewards,
  xvsVestingVaultPoolInfos,
  xvsVestingVaultPendingRewards,
  xvsVestingVaultPendingWithdrawalsBeforeUpgrade,
  tokenPriceMapping,
  venusLensPendingRewards,
  primePendingRewards,
  isPrimeContractPaused,
  isVaiVaultContractPaused,
  isXvsVestingVaultContractPaused,
  merklPendingRewards,
}: {
  tokens: Token[];
  xvsVestingVaultPoolInfos: (
    | ReadContractReturnType<
        typeof xvsVaultAbi,
        'poolInfos',
        ContractFunctionArgs<typeof xvsVaultAbi, 'pure' | 'view', 'poolInfos'>
      >
    | undefined
  )[];
  xvsVestingVaultPendingRewards: (bigint | undefined)[];
  xvsVestingVaultPendingWithdrawalsBeforeUpgrade: (bigint | undefined)[];
  tokenPriceMapping: Record<string, BigNumber>;
  isVaiVaultContractPaused: boolean;
  isXvsVestingVaultContractPaused: boolean;
  isPrimeContractPaused: boolean;
  vaiVaultPendingXvsMantissa?: bigint;
  venusLensPendingRewards?: ReadContractReturnType<
    typeof venusLensAbi,
    'pendingRewards',
    ContractFunctionArgs<typeof venusLensAbi, 'pure' | 'view', 'pendingRewards'>
  >;
  isolatedPoolComptrollerAddresses: Address[];
  isolatedPoolsPendingRewards: Array<
    | ReadContractReturnType<
        typeof poolLensAbi,
        'getPendingRewards',
        ContractFunctionArgs<typeof poolLensAbi, 'pure' | 'view', 'getPendingRewards'>
      >
    | undefined
  >;
  legacyPoolComptrollerContractAddress?: Address;
  primePendingRewards?: SimulateContractReturnType<
    typeof primeAbi,
    'getPendingRewards',
    ContractFunctionArgs<typeof primeAbi, 'nonpayable' | 'payable', 'getPendingRewards'>
  >['result'];
  merklPendingRewards: PendingExternalRewardSummary[];
}): PendingRewardGroup[] => {
  const pendingRewardGroups: PendingRewardGroup[] = [];

  // Extract pending rewards from markets
  const legacyPoolPendingRewardGroup =
    venusLensPendingRewards && legacyPoolComptrollerContractAddress
      ? formatToLegacyPoolPendingRewardGroup({
          venusLensPendingRewards,
          tokenPriceMapping,
          comptrollerContractAddress: legacyPoolComptrollerContractAddress,
          tokens,
        })
      : undefined;

  if (legacyPoolPendingRewardGroup) {
    pendingRewardGroups.push(legacyPoolPendingRewardGroup);
  }

  // Extract pending rewards from isolated pools
  const isolatedPoolsPendingRewardSummaries = isolatedPoolsPendingRewards.reduce<
    PendingInternalRewardSummary[]
  >(
    (acc, rawPendingRewards, index) =>
      rawPendingRewards
        ? [
            ...acc,
            ...rawPendingRewards.map<PendingInternalRewardSummary>(raw => ({
              type: 'isolatedPool',
              poolComptrollerAddress: isolatedPoolComptrollerAddresses[index],
              distributorAddress: raw.distributorAddress,
              rewardTokenAddress: raw.rewardTokenAddress,
              totalRewards: new BigNumber(raw.totalRewards.toString()),
              pendingRewards: raw.pendingRewards.map(pr => ({
                vTokenAddress: pr.vTokenAddress,
                amountMantissa: new BigNumber(pr.amount.toString()),
              })),
            })),
          ]
        : acc,
    [],
  );

  const pendingRewardsPerIsolatedPool = isolatedPoolsPendingRewardSummaries.reduce<
    Record<Address, PendingInternalRewardSummary[]>
  >(
    (acc, rs) => ({
      ...acc,
      [rs.poolComptrollerAddress]: acc[rs.poolComptrollerAddress]
        ? [...acc[rs.poolComptrollerAddress], rs]
        : [rs],
    }),
    {},
  );

  const isolatedPoolPendingRewardGroups = Object.keys(pendingRewardsPerIsolatedPool).reduce<
    PendingRewardGroup[]
  >((acc, poolComptrollerAddress) => {
    const isolatedPoolPendingRewardGroup = formatToIsolatedPoolPendingRewardGroup({
      comptrollerContractAddress: poolComptrollerAddress as Address,
      rewardSummaries: pendingRewardsPerIsolatedPool[poolComptrollerAddress as Address],
      tokenPriceMapping,
      tokens,
    });

    return isolatedPoolPendingRewardGroup ? [...acc, isolatedPoolPendingRewardGroup] : acc;
  }, []);

  pendingRewardGroups.push(...isolatedPoolPendingRewardGroups);

  // Extract pending rewards from VAI vault
  const vaiVaultPendingRewardAmountMantissa =
    vaiVaultPendingXvsMantissa && new BigNumber(vaiVaultPendingXvsMantissa.toString());

  const vaiVaultPendingRewardGroup =
    vaiVaultPendingRewardAmountMantissa &&
    formatToVaultPendingRewardGroup({
      isDisabled: isVaiVaultContractPaused,
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
      const stakedTokenAddress = xvsVestingVaultPoolInfos[index]?.[0];
      const unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa =
        xvsVestingVaultPendingWithdrawalsBeforeUpgrade[index];

      if (
        !stakedTokenAddress ||
        xvsVestingVaultPendingReward === undefined ||
        unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa === undefined
      ) {
        return;
      }

      return formatToVestingVaultPendingRewardGroup({
        poolIndex: index,
        isDisabled: isXvsVestingVaultContractPaused,
        userPendingRewardsAmountMantissa: new BigNumber(xvsVestingVaultPendingReward.toString()),
        userPendingWithdrawalsBeforeUpgradeAmountMantissa: new BigNumber(
          unsafeUserPendingWithdrawalsBeforeUpgradeAmountMantissa.toString(),
        ),
        tokenPriceMapping,
        tokens,
        stakedTokenAddress,
      });
    })
    .filter((group): group is XvsVestingVaultPendingRewardGroup => !!group);

  pendingRewardGroups.push(...xvsVestingVaultPendingRewardGroups);

  // Extract pending rewards from Prime
  let primePendingRewardGroup: PrimePendingRewardGroup | undefined;

  if (primePendingRewards) {
    primePendingRewardGroup = formatToPrimePendingRewardGroup({
      isPrimeContractPaused,
      primePendingRewards,
      tokenPriceMapping,
      tokens,
    });
  }

  if (primePendingRewardGroup) {
    pendingRewardGroups.push(primePendingRewardGroup);
  }

  const merklPendingRewardGroups = formatToExternalPendingRewardGroup({
    externalRewardsSummaries: merklPendingRewards,
    tokens,
    tokenPriceMapping,
  });

  pendingRewardGroups.push(...merklPendingRewardGroups);

  return pendingRewardGroups;
};

export default formatOutput;
