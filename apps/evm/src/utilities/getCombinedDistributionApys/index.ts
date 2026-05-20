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
  usePrimeMax?: boolean;
}

const getCombinedDistributionApys = ({
  asset,
  usePrimeMax = false,
}: GetCombinedDistributionApysInput) => {
  const supply = aggregatePercentages({
    distributions: asset.supplyTokenDistributions.filter(d => d.isActive),
  });
  const borrow = aggregatePercentages({
    distributions: asset.borrowTokenDistributions.filter(d => d.isActive),
  });

  const supplyPrimeBoostPercentage = usePrimeMax
    ? BigNumber.maximum(supply.apyPrimePercentage, supply.apyPrimeSimulationPercentage)
    : supply.apyPrimePercentage;
  const borrowPrimeBoostPercentage = usePrimeMax
    ? BigNumber.maximum(borrow.apyPrimePercentage, borrow.apyPrimeSimulationPercentage)
    : borrow.apyPrimePercentage;

  const totalSupplyApyBoostPercentage = supply.apyRewardsPercentage.plus(
    supplyPrimeBoostPercentage,
  );
  const totalBorrowApyBoostPercentage = borrow.apyRewardsPercentage.plus(
    borrowPrimeBoostPercentage,
  );

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
