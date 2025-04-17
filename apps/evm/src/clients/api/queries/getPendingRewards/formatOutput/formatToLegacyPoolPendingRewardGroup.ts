import BigNumber from 'bignumber.js';

import type { Token } from 'types';

import type { venusLensAbi } from 'libs/contracts';
import type { Address, ContractFunctionArgs, ReadContractReturnType } from 'viem';
import type { LegacyPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToLegacyPoolPendingRewardGroup({
  comptrollerContractAddress,
  venusLensPendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: Address;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
  venusLensPendingRewards: ReadContractReturnType<
    typeof venusLensAbi,
    'pendingRewards',
    ContractFunctionArgs<typeof venusLensAbi, 'pure' | 'view', 'pendingRewards'>
  >;
}) {
  const rewardSummaryData = formatRewardSummaryData({
    rewardSummary: {
      type: 'legacyPool',
      distributorAddress: venusLensPendingRewards.distributorAddress,
      rewardTokenAddress: venusLensPendingRewards.rewardTokenAddress,
      totalRewards: new BigNumber(venusLensPendingRewards.totalRewards.toString()),
      pendingRewards: venusLensPendingRewards.pendingRewards.map(({ amount, vTokenAddress }) => ({
        amountMantissa: new BigNumber(amount.toString()),
        vTokenAddress,
      })),
    },
    tokenPriceMapping,
    tokens,
  });

  if (!rewardSummaryData) {
    return;
  }

  const { rewardToken, rewardAmountMantissa, rewardAmountCents, vTokenAddressesWithPendingReward } =
    rewardSummaryData;

  const pendingRewardGroup: LegacyPoolPendingRewardGroup = {
    type: 'legacyPool',
    comptrollerAddress: comptrollerContractAddress,
    rewardToken,
    rewardAmountCents,
    rewardAmountMantissa,
    vTokenAddressesWithPendingReward,
  };

  return pendingRewardGroup;
}

export default formatToLegacyPoolPendingRewardGroup;
