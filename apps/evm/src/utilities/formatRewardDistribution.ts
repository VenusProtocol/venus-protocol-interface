import type BigNumber from 'bignumber.js';

import type { AssetDistribution, Token } from 'types';
import { calculateApy } from 'utilities';

export interface FormatDistributionInput {
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
}

const formatRewardDistribution = ({
  rewardToken,
  rewardTokenPriceDollars,
  dailyDistributedRewardTokens,
  balanceDollars,
}: FormatDistributionInput): AssetDistribution => {
  // Convert distribution to dollars
  const dailyDistributedDollars =
    dailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);

  // Calculate APY
  const apyPercentage = calculateApy({
    dailyRate: dailyDistributedDollars.div(
      // Set default balance of 1 to prevent division by 0 when balance is 0
      balanceDollars.isEqualTo(0) ? 1 : balanceDollars,
    ),
  });

  return {
    type: 'rewardDistributor',
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
  };
};

export default formatRewardDistribution;
