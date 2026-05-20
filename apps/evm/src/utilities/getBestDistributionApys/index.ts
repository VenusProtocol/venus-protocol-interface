import type { Asset } from 'types';
import getCombinedDistributionApys from 'utilities/getCombinedDistributionApys';

export interface GetBestDistributionApysInput {
  asset: Asset;
}

const getBestDistributionApys = ({ asset }: GetBestDistributionApysInput) => {
  const combined = getCombinedDistributionApys({ asset });

  const isUserPrimeSupply = combined.supplyApyPrimePercentage.isGreaterThan(0);
  const isUserPrimeBorrow = combined.borrowApyPrimePercentage.isGreaterThan(0);

  const supplyPrimeBoostPercentage = isUserPrimeSupply
    ? combined.supplyApyPrimePercentage
    : combined.supplyApyPrimeSimulationPercentage;
  const borrowPrimeBoostPercentage = isUserPrimeBorrow
    ? combined.borrowApyPrimePercentage
    : combined.borrowApyPrimeSimulationPercentage;

  const totalSupplyApyBoostPercentage = combined.supplyApyRewardsPercentage.plus(
    supplyPrimeBoostPercentage,
  );
  const totalBorrowApyBoostPercentage = combined.borrowApyRewardsPercentage.plus(
    borrowPrimeBoostPercentage,
  );

  return {
    ...combined,
    totalSupplyApyBoostPercentage,
    totalBorrowApyBoostPercentage,
    totalSupplyApyPercentage: asset.supplyApyPercentage.plus(totalSupplyApyBoostPercentage),
    totalBorrowApyPercentage: asset.borrowApyPercentage.minus(totalBorrowApyBoostPercentage),
  };
};

export default getBestDistributionApys;
