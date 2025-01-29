import type BigNumber from 'bignumber.js';

import type { MerklDistribution, RewardDistributorDistribution, Token } from 'types';
import { calculateYearlyPercentageRate } from 'utilities';

export interface FormatDistributionInput {
  rewardType: 'venus' | 'merkl';
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
  description?: string;
  claimUrl?: string;
}

const formatRewardDistribution = ({
  rewardType,
  rewardToken,
  rewardTokenPriceDollars,
  dailyDistributedRewardTokens,
  balanceDollars,
  description,
  claimUrl,
}: FormatDistributionInput) => {
  // Convert distribution to dollars
  const dailyDistributedDollars =
    dailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);

  // Calculate APY
  const apyPercentage = calculateYearlyPercentageRate({
    dailyPercentageRate: dailyDistributedDollars.div(
      // Set default balance of 1 to prevent division by 0 when balance is 0
      balanceDollars.isEqualTo(0) ? 1 : balanceDollars,
    ),
  });

  const baseProps = {
    type: rewardType,
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
    description,
  };

  if (rewardType === 'merkl') {
    const distribution: MerklDistribution = {
      ...baseProps,
      type: 'merkl',
      claimUrl: claimUrl!,
    };

    return distribution;
  }

  const distribution: RewardDistributorDistribution = {
    ...baseProps,
    type: 'venus',
  };

  return distribution;
};

export default formatRewardDistribution;
