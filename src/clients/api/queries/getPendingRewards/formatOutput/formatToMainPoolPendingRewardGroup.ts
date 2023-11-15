import BigNumber from 'bignumber.js';
import { VenusLens } from 'packages/contracts';
import { Token } from 'types';

import { MainPoolPendingRewardGroup } from '../types';
import formatRewardSummaryData from './formatRewardSummaryData';

function formatToMainPoolPendingRewardGroup({
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

  const pendingRewardGroup: MainPoolPendingRewardGroup = {
    type: 'mainPool',
    comptrollerAddress: comptrollerContractAddress,
    rewardToken,
    rewardAmountCents,
    rewardAmountMantissa,
    vTokenAddressesWithPendingReward,
  };

  return pendingRewardGroup;
}

export default formatToMainPoolPendingRewardGroup;
