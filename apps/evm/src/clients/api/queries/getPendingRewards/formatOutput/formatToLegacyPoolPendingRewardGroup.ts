import BigNumber from 'bignumber.js';

import { VenusLens } from 'libs/contracts';
import { Token } from 'types';

import { LegacyPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToLegacyPoolPendingRewardGroup({
  comptrollerContractAddress,
  venusLensPendingRewards,
  tokenPriceMapping,
  tokens,
}: {
  comptrollerContractAddress: string;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
  venusLensPendingRewards: Awaited<ReturnType<VenusLens['pendingRewards']>>;
}) {
  const rewardSummaryData = formatRewardSummaryData({
    rewardSummary: venusLensPendingRewards,
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
