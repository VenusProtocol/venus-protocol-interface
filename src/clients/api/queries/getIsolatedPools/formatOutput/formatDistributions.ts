import BigNumber from 'bignumber.js';
import { AssetDistribution } from 'types';
import { calculateApy } from 'utilities';

import { DailyDistributedTokensMapping } from './formatDailyDistributedTokensMapping';

export interface FormatDistributionsInput {
  dailyDistributedTokens: DailyDistributedTokensMapping[string];
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
}

const formatDistributions = ({
  dailyDistributedTokens,
  supplyBalanceTokens,
  borrowBalanceTokens,
}: FormatDistributionsInput) =>
  dailyDistributedTokens.map(
    ({ token, tokenPriceDollars, borrowDailyDistributedTokens, supplyDailyDistributedTokens }) => {
      // Convert token values to dollars
      const supplyDailyDistributedDollars =
        supplyDailyDistributedTokens.multipliedBy(tokenPriceDollars);
      const borrowDailyDistributedDollars =
        borrowDailyDistributedTokens.multipliedBy(tokenPriceDollars);

      const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(tokenPriceDollars);
      const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(tokenPriceDollars);

      // Calculate APYs
      const supplyApyPercentage = calculateApy({
        dailyDistributedTokens: supplyDailyDistributedDollars.div(supplyBalanceDollars),
      });

      const borrowApyPercentage = calculateApy({
        dailyDistributedTokens: borrowDailyDistributedDollars.div(borrowBalanceDollars),
      });

      const assetDistribution: AssetDistribution = {
        token,
        supplyApyPercentage,
        borrowApyPercentage,
        supplyDailyDistributedTokens,
        borrowDailyDistributedTokens,
      };

      return assetDistribution;
    },
  );

export default formatDistributions;
