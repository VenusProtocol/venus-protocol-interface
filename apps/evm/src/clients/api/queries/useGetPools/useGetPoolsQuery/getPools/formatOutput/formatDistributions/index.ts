import type BigNumber from 'bignumber.js';
import { isBefore } from 'date-fns';
import type { ApiPointsDistribution, ApiRewardDistributor, PointDistribution, Token } from 'types';
import { formatApiRewardDistributors } from 'utilities/formatApiRewardDistributors';

import type { PrimeApy } from '../../../../types';

export type FormatDistributionsInput = {
  underlyingTokenPriceDollars: BigNumber;
  tokens: Token[];
  apiRewardsDistributors: ApiRewardDistributor[];
  apiPointsDistributions: ApiPointsDistribution[];
  currentBlockNumber: bigint;
  supplyBalanceTokens: BigNumber;
  borrowBalanceTokens: BigNumber;
  underlyingToken: Token;
  primeApy?: PrimeApy;
  blocksPerDay?: number;
};

export const formatDistributions = ({
  blocksPerDay,
  underlyingTokenPriceDollars,
  tokens,
  apiRewardsDistributors,
  apiPointsDistributions,
  currentBlockNumber,
  supplyBalanceTokens,
  borrowBalanceTokens,
  underlyingToken,
  primeApy,
}: FormatDistributionsInput) => {
  const supplyBalanceDollars = supplyBalanceTokens.multipliedBy(underlyingTokenPriceDollars);
  const borrowBalanceDollars = borrowBalanceTokens.multipliedBy(underlyingTokenPriceDollars);

  const { supplyTokenDistributions, borrowTokenDistributions } = formatApiRewardDistributors({
    apiRewardDistributors: apiRewardsDistributors,
    tokens,
    supplyBalanceDollars,
    borrowBalanceDollars,
    blocksPerDay,
    currentBlockNumber,
  });

  // Add Prime distributions
  if (primeApy) {
    supplyTokenDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.supplyApy,
      token: underlyingToken,
      isActive: true,
    });

    borrowTokenDistributions.push({
      type: 'prime',
      apyPercentage: primeApy.borrowApy,
      token: underlyingToken,
      isActive: true,
    });
  }

  // Add point distributions
  const borrowPointDistributions: PointDistribution[] = [];
  const supplyPointDistributions: PointDistribution[] = [];

  apiPointsDistributions.forEach(
    ({ startDate, endDate, action, title, description, incentive, logoUrl, extraInfoUrl }) => {
      const p: PointDistribution = {
        title,
        description,
        incentive,
        logoUrl,
        extraInfoUrl,
      };

      const now = new Date();

      // Check if point distribution is active
      if ((startDate && isBefore(now, startDate)) || (endDate && isBefore(endDate, now))) {
        return;
      }

      if (action === 'supply') {
        supplyPointDistributions.push(p);
      } else if (action === 'borrow') {
        borrowPointDistributions.push(p);
      }
    },
  );

  return {
    supplyTokenDistributions,
    borrowTokenDistributions,
    borrowPointDistributions,
    supplyPointDistributions,
  };
};
