import BigNumber from 'bignumber.js';

import type { Asset } from 'types';
import getCombinedDistributionApys from 'utilities/getCombinedDistributionApys';

export interface GetBestDistributionApysInput {
  asset: Asset;
}

const getBestDistributionApys = ({ asset }: GetBestDistributionApysInput) => {
  const combined = getCombinedDistributionApys({ asset });

  const supplyPrimeBoostPercentage = BigNumber.maximum(
    combined.supplyApyPrimePercentage,
    combined.supplyApyPrimeSimulationPercentage,
  );
  const borrowPrimeBoostPercentage = BigNumber.maximum(
    combined.borrowApyPrimePercentage,
    combined.borrowApyPrimeSimulationPercentage,
  );

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
