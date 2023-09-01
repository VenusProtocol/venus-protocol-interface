import BigNumber from 'bignumber.js';
import { AssetDistribution, Token } from 'types';
import { calculateApy } from 'utilities';

export interface FormatDistributionInput {
  rewardToken: Token;
  rewardTokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: BigNumber;
  balanceDollars: BigNumber;
}

const formatDistribution = ({
  rewardToken,
  rewardTokenPriceDollars,
  dailyDistributedRewardTokens,
  balanceDollars,
}: FormatDistributionInput) => {
  // Convert distribution to dollars
  const dailyDistributedDollars =
    dailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);

  // Calculate APY
  const apyPercentage = calculateApy({
    dailyRate: dailyDistributedDollars.div(balanceDollars),
  });

  const assetDistribution: AssetDistribution = {
    token: rewardToken,
    apyPercentage,
    dailyDistributedTokens: dailyDistributedRewardTokens,
  };

  return assetDistribution;
};

export default formatDistribution;
