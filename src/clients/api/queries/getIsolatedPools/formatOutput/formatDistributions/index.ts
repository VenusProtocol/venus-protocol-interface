import BigNumber from 'bignumber.js';
import { AssetDistribution } from 'types';
import { formatDistribution } from 'utilities';

import { RewardTokenDataMapping } from '../formatRewardTokenDataMapping';

export interface FormatDistributionsInput {
  tokenPriceDollars: BigNumber;
  rewardTokenData: RewardTokenDataMapping[string];
  currentBlockNumber: number;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
}

const formatDistributions = ({
  tokenPriceDollars,
  rewardTokenData,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
}: FormatDistributionsInput) => {
  const supplyDistributions: AssetDistribution[] = [];
  const borrowDistributions: AssetDistribution[] = [];

  // Convert balances to dollars
  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);

  rewardTokenData.forEach(
    ({
      rewardToken,
      rewardTokenPriceDollars,
      borrowDailyDistributedRewardTokens,
      supplyDailyDistributedRewardTokens,
      borrowLastRewardBlockNumber,
      supplyLastRewardBlockNumber,
    }) => {
      // Filter out passed supply distributions
      if (supplyLastRewardBlockNumber === 0 || currentBlockNumber <= supplyLastRewardBlockNumber) {
        supplyDistributions.push(
          formatDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens: supplyDailyDistributedRewardTokens,
            balanceDollars: supplyBalanceDollars,
          }),
        );
      }

      // Filter out passed borrow distributions
      if (borrowLastRewardBlockNumber === 0 || currentBlockNumber <= borrowLastRewardBlockNumber) {
        borrowDistributions.push(
          formatDistribution({
            rewardToken,
            rewardTokenPriceDollars,
            dailyDistributedRewardTokens: borrowDailyDistributedRewardTokens,
            balanceDollars: borrowBalanceDollars,
          }),
        );
      }
    },
  );

  return {
    supplyDistributions,
    borrowDistributions,
  };
};

export default formatDistributions;
