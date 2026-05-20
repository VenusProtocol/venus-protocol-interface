import BigNumber from 'bignumber.js';

import type { Asset, TokenDistribution } from 'types';

interface AggregatePercentagesInput {
  distributions: TokenDistribution[];
}

const aggregatePercentages = ({ distributions }: AggregatePercentagesInput) =>
  distributions.reduce<{
    apyRewardsPercentage: BigNumber;
    apyPrimePercentage: BigNumber;
    apyPrimeSimulationPercentage: BigNumber;
  }>(
    (acc, distribution) => {
      if (
        distribution.type === 'venus' ||
        distribution.type === 'merkl' ||
        distribution.type === 'intrinsic' ||
        distribution.type === 'off-chain' ||
        distribution.type === 'yield-to-maturity'
      ) {
        return {
          ...acc,
          apyRewardsPercentage: acc.apyRewardsPercentage.plus(distribution.apyPercentage),
        };
      }

      if (distribution.type === 'prime') {
        return {
          ...acc,
          apyPrimePercentage: acc.apyPrimePercentage.plus(distribution.apyPercentage),
        };
      }

      if (distribution.type === 'primeSimulation') {
        return {
          ...acc,
          apyPrimeSimulationPercentage: acc.apyPrimeSimulationPercentage.plus(
            distribution.apyPercentage,
          ),
        };
      }

      return acc;
    },
    {
      apyRewardsPercentage: new BigNumber(0),
      apyPrimePercentage: new BigNumber(0),
      apyPrimeSimulationPercentage: new BigNumber(0),
    },
  );

export interface GetCombinedDistributionApysInput {
  asset: Asset;
}

const getCombinedDistributionApys = ({ asset }: GetCombinedDistributionApysInput) => {
  const supply = aggregatePercentages({
    distributions: asset.supplyTokenDistributions.filter(d => d.isActive),
  });
  const borrow = aggregatePercentages({
    distributions: asset.borrowTokenDistributions.filter(d => d.isActive),
  });

  const totalSupplyApyBoostPercentage = supply.apyRewardsPercentage.plus(supply.apyPrimePercentage);
  const totalBorrowApyBoostPercentage = borrow.apyRewardsPercentage.plus(borrow.apyPrimePercentage);

  return {
    supplyApyRewardsPercentage: supply.apyRewardsPercentage,
    borrowApyRewardsPercentage: borrow.apyRewardsPercentage,
    supplyApyPrimePercentage: supply.apyPrimePercentage,
    borrowApyPrimePercentage: borrow.apyPrimePercentage,
    supplyApyPrimeSimulationPercentage: supply.apyPrimeSimulationPercentage,
    borrowApyPrimeSimulationPercentage: borrow.apyPrimeSimulationPercentage,
    totalSupplyApyBoostPercentage,
    totalBorrowApyBoostPercentage,
    totalSupplyApyPercentage: asset.supplyApyPercentage.plus(totalSupplyApyBoostPercentage),
    totalBorrowApyPercentage: asset.borrowApyPercentage.minus(totalBorrowApyBoostPercentage),
  };
};

export default getCombinedDistributionApys;
