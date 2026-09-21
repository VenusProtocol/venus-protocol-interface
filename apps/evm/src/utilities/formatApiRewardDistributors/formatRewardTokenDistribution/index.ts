import type BigNumber from 'bignumber.js';

import type { ApiRewardDistributor, Token, TokenDistribution } from 'types';
import { calculateDailyTokenRate } from 'utilities/calculateDailyTokenRate';
import { formatRewardDistribution } from './formatRewardDistribution';
import { isDistributingRewards } from './isDistributingRewards';

interface FormatRewardTokenDistributionInput {
  isActive: boolean;
  isTimeBasedOrMerklReward: boolean;
  isCollateralGatedCampaign?: boolean;
  lastRewardingBlockOrTimestamp: string;
  currentBlockNumber?: bigint;
  rateMantissa: string;
  blocksPerDay?: number;
  marketAddress: ApiRewardDistributor['marketAddress'];
  rewardType: ApiRewardDistributor['rewardType'];
  rewardToken: Token;
  rewardDetails: ApiRewardDistributor['rewardDetails'];
  apyPercentage: BigNumber;
}

export const formatRewardTokenDistribution = ({
  isActive,
  isTimeBasedOrMerklReward,
  isCollateralGatedCampaign = false,
  lastRewardingBlockOrTimestamp,
  currentBlockNumber,
  rateMantissa,
  blocksPerDay,
  marketAddress,
  rewardType,
  rewardToken,
  rewardDetails,
  apyPercentage,
}: FormatRewardTokenDistributionInput): TokenDistribution | undefined => {
  const isReward = isCollateralGatedCampaign || Number(rateMantissa) > 0;

  if (!isReward) {
    return undefined;
  }

  const lastRewardingTimestamp = isTimeBasedOrMerklReward
    ? +lastRewardingBlockOrTimestamp
    : undefined;
  const lastRewardingBlock = isTimeBasedOrMerklReward ? undefined : +lastRewardingBlockOrTimestamp;

  const isDistributingReward = isDistributingRewards({
    isTimeBasedOrMerklReward,
    lastRewardingTimestamp,
    lastRewardingBlock,
    currentBlockNumber,
  });

  const dailyDistributedRewardTokens = calculateDailyTokenRate({
    rateMantissa,
    decimals: rewardToken.decimals,
    blocksPerDay,
  });

  return formatRewardDistribution({
    isActive: isActive && isDistributingReward,
    marketAddress,
    rewardType,
    rewardToken,
    dailyDistributedRewardTokens,
    rewardDetails,
    apyPercentage,
  });
};
