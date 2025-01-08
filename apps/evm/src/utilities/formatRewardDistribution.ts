import type BigNumber from 'bignumber.js';

import type { AssetDistribution, Token } from 'types';
import { calculateYearlyPercentageRate } from 'utilities';

export interface FormatDistributionInput {
  rewardType: 'venus' | 'merkl';
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
  rewardDescription?: string;
}

const formatRewardDistribution = ({
  rewardType,
  rewardToken,
  rewardTokenPriceDollars,
  dailyDistributedRewardTokens,
  balanceDollars,
  rewardDescription,
}: FormatDistributionInput): AssetDistribution => {
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

  return {
    type: rewardType,
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
    rewardDescription,
  };
};

export default formatRewardDistribution;
