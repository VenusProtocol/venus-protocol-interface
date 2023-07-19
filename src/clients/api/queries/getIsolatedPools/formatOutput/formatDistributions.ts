import BigNumber from 'bignumber.js';
import { AssetDistribution } from 'types';
import { calculateApy } from 'utilities';

import { DailyDistributedRewardTokensMapping } from './formatDailyDistributedRewardTokensMapping';

export interface FormatDistributionsInput {
  tokenPriceDollars: BigNumber;
  dailyDistributedRewardTokens: DailyDistributedRewardTokensMapping[string];
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
}

const formatDistributions = ({
  tokenPriceDollars,
  dailyDistributedRewardTokens,
  supplyBalanceTokens,
  borrowBalanceTokens,
}: FormatDistributionsInput) => {
  // Convert balances to dollars
  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);

  return dailyDistributedRewardTokens.map(
    ({
      rewardToken,
      rewardTokenPriceDollars,
      borrowDailyDistributedRewardTokens,
      supplyDailyDistributedRewardTokens,
    }) => {
      // Convert distributions to dollars
      const supplyDailyDistributedDollars =
        supplyDailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);
      const borrowDailyDistributedDollars =
        borrowDailyDistributedRewardTokens.multipliedBy(rewardTokenPriceDollars);

      // Calculate APYs
      const supplyApyPercentage = calculateApy({
        dailyDistributedTokens: supplyDailyDistributedDollars.div(supplyBalanceDollars),
      });

      const borrowApyPercentage = calculateApy({
        dailyDistributedTokens: borrowDailyDistributedDollars.div(borrowBalanceDollars),
      });

      const assetDistribution: AssetDistribution = {
        token: rewardToken,
        supplyApyPercentage,
        borrowApyPercentage,
        supplyDailyDistributedTokens: supplyDailyDistributedRewardTokens,
        borrowDailyDistributedTokens: borrowDailyDistributedRewardTokens,
      };

      return assetDistribution;
    },
  );
};

export default formatDistributions;
