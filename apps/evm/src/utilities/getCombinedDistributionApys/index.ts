import type { Asset } from 'types';
import getCombinedApy from '../getCombinedApy';

export interface GetCombinedDistributionApysInput {
  asset: Asset;
}

const getCombinedDistributionApys = ({ asset }: GetCombinedDistributionApysInput) => {
  const supply = getCombinedApy({
    type: 'supply',
    baseApyPercentage: asset.supplyApyPercentage,
    tokenDistributions: asset.supplyTokenDistributions,
  });
  const borrow = getCombinedApy({
    type: 'borrow',
    baseApyPercentage: asset.borrowApyPercentage,
    tokenDistributions: asset.borrowTokenDistributions,
  });

  return {
    supplyApyRewardsPercentage: supply.apyRewardsPercentage,
    borrowApyRewardsPercentage: borrow.apyRewardsPercentage,
    supplyApyPrimePercentage: supply.apyPrimePercentage,
    borrowApyPrimePercentage: borrow.apyPrimePercentage,
    supplyApyPrimeSimulationPercentage: supply.apyPrimeSimulationPercentage,
    borrowApyPrimeSimulationPercentage: borrow.apyPrimeSimulationPercentage,
    totalSupplyApyBoostPercentage: supply.totalApyBoostPercentage,
    totalBorrowApyBoostPercentage: borrow.totalApyBoostPercentage,
    totalSupplyApyPercentage: supply.totalApyPercentage,
    totalBorrowApyPercentage: borrow.totalApyPercentage,
  };
};

export default getCombinedDistributionApys;
