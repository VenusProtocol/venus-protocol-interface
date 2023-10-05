import BigNumber from 'bignumber.js';
import { Asset, AssetDistribution } from 'types';

interface AggregatePercentagesInput {
  distributions: AssetDistribution[];
}

const aggregatePercentages = ({ distributions }: AggregatePercentagesInput) =>
  distributions.reduce<{
    apyRewardsPercentage: BigNumber;
    apyPrimeBoostPercentage?: BigNumber;
    apyHypotheticalPrimeBoostPercentage?: BigNumber;
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
          apyPrimeBoostPercentage: (acc.apyPrimeBoostPercentage || new BigNumber(0)).plus(
            distribution.apyPercentage,
          ),
        };
      }

      if (distribution.type === 'hypotheticalPrime') {
        return {
          ...acc,
          apyHypotheticalPrimeBoostPercentage: (
            acc.apyHypotheticalPrimeBoostPercentage || new BigNumber(0)
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
    supplyApyPrimeBoostPercentage: supply.apyPrimeBoostPercentage,
    borrowApyPrimeBoostPercentage: borrow.apyPrimeBoostPercentage,
    supplyApyHypotheticalPrimeBoostPercentage: supply.apyHypotheticalPrimeBoostPercentage,
    borrowApyHypotheticalPrimeBoostPercentage: borrow.apyHypotheticalPrimeBoostPercentage,
    totalSupplyApyPercentage: supply.apyRewardsPercentage.plus(supply.apyPrimeBoostPercentage || 0),
    totalBorrowApyPercentage: borrow.apyRewardsPercentage.minus(
      borrow.apyPrimeBoostPercentage || 0,
    ),
  };
};

export default getCombinedDistributionApys;
