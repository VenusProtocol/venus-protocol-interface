import BigNumber from 'bignumber.js';

import { Asset, AssetDistribution } from 'types';

interface AggregatePercentagesInput {
  distributions: AssetDistribution[];
}

const aggregatePercentages = ({ distributions }: AggregatePercentagesInput) =>
  distributions.reduce<{
    apyRewardsPercentage: BigNumber;
    apyPrimePercentage?: BigNumber;
    apyPrimeSimulationPercentage?: BigNumber;
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

      if (distribution.type === 'primeSimulation') {
        return {
          ...acc,
          apyPrimeSimulationPercentage: (acc.apyPrimeSimulationPercentage || new BigNumber(0)).plus(
            distribution.apyPercentage,
          ),
        };
      }

      return acc;
    },
    {
      apyRewardsPercentage: new BigNumber(0),
    },
  );

export interface GetCombinedDistributionApysInput {
  asset: Pick<Asset, 'supplyDistributions' | 'borrowDistributions'>;
}

const getCombinedDistributionApys = ({ asset }: GetCombinedDistributionApysInput) => {
  const supply = aggregatePercentages({ distributions: asset.supplyDistributions });
  const borrow = aggregatePercentages({ distributions: asset.borrowDistributions });

  return {
    supplyApyRewardsPercentage: supply.apyRewardsPercentage,
    borrowApyRewardsPercentage: borrow.apyRewardsPercentage,
    supplyApyPrimePercentage: supply.apyPrimePercentage,
    borrowApyPrimePercentage: borrow.apyPrimePercentage,
    supplyApyPrimeSimulationPercentage: supply.apyPrimeSimulationPercentage,
    borrowApyPrimeSimulationPercentage: borrow.apyPrimeSimulationPercentage,
    totalSupplyApyPercentage: supply.apyRewardsPercentage.plus(supply.apyPrimePercentage || 0),
    totalBorrowApyPercentage: borrow.apyRewardsPercentage.plus(borrow.apyPrimePercentage || 0),
  };
};

export default getCombinedDistributionApys;
