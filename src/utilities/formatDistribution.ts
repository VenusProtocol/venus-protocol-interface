import BigNumber from 'bignumber.js';
import { AssetDistribution, Token } from 'types';
import { calculateApy } from 'utilities';

export interface FormatDistributionInput {
  type: AssetDistribution['type'];
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
}

const formatDistribution = ({
  type,
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

  if (type === 'rewardDistributor') {
    return {
      type,
      token: rewardToken,
      apyPercentage,
      dailyDistributedTokens: dailyDistributedRewardTokens,
    };
  }

  return {
    type,
    token: rewardToken,
    apyPercentage,
  };
};

export default formatDistribution;
