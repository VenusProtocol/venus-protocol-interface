import BigNumber from 'bignumber.js';
import { Asset, AssetDistribution } from 'types';

interface AggregatePercentagesInput {
  distributions: AssetDistribution[];
}

const aggregatePercentages = ({ distributions }: AggregatePercentagesInput) =>
  distributions.reduce<{
    apyRewardsPercentage: BigNumber;
    apyPrimePercentage?: BigNumber;
    apyHypotheticalPrimePercentage?: BigNumber;
  }>(
    (acc, distribution) => {
      if (distribution.type === 'rewardDistributor') {
        return {
          ...acc,
          apyRewardsPercentage: acc.apyRewardsPercentage.plus(distribution.apyPercentage),
        };
      }

      if (distribution.type === 'prime') {
        return {
          ...acc,
          apyPrimePercentage: (acc.apyPrimePercentage || new BigNumber(0)).plus(
            distribution.apyPercentage,
          ),
        };
      }

      if (distribution.type === 'hypotheticalPrime') {
        return {
          ...acc,
          apyHypotheticalPrimePercentage: (
            acc.apyHypotheticalPrimePercentage || new BigNumber(0)
          ).plus(distribution.apyPercentage),
        };
      }

      return acc;
    },
    {
      apyRewardsPercentage: new BigNumber(0),
    },
  );

export interface GetCombinedDistributionApysInput {
  asset: Asset;
}

const getCombinedDistributionApys = ({ asset }: GetCombinedDistributionApysInput) => {
  const supply = aggregatePercentages({ distributions: asset.supplyDistributions });
  const borrow = aggregatePercentages({ distributions: asset.borrowDistributions });

  return {
    supplyApyRewardsPercentage: supply.apyRewardsPercentage,
    borrowApyRewardsPercentage: borrow.apyRewardsPercentage,
    supplyApyPrimePercentage: supply.apyPrimePercentage,
    borrowApyPrimePercentage: borrow.apyPrimePercentage,
    supplyApyHypotheticalPrimePercentage: supply.apyHypotheticalPrimePercentage,
    borrowApyHypotheticalPrimePercentage: borrow.apyHypotheticalPrimePercentage,
    totalSupplyApyPercentage: supply.apyRewardsPercentage.plus(supply.apyPrimePercentage || 0),
    totalBorrowApyPercentage: borrow.apyRewardsPercentage.minus(borrow.apyPrimePercentage || 0),
  };
};

export default getCombinedDistributionApys;
