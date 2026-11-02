import BigNumber from 'bignumber.js';
import type { TokenDistribution } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

export const getRankingApyPercentage = ({
  type,
  baseApyPercentage,
  tokenDistributions,
}: {
  type: 'supply' | 'borrow';
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
}) => {
  const { totalApyPercentage, apyPrimePercentage, apyPrimeSimulationPercentage } = getCombinedApy({
    type,
    baseApyPercentage,
    tokenDistributions,
  });

  const gatedEstimatePercentage = tokenDistributions.reduce(
    (total, distribution) =>
      distribution.isActive &&
      distribution.type === 'merkl' &&
      distribution.collateralGate?.isUserEligible === false
        ? total.plus(distribution.collateralGate.maxApyPercentage)
        : total,
    new BigNumber(0),
  );

  const estimatePercentage = gatedEstimatePercentage.plus(
    apyPrimePercentage.isGreaterThan(0) ? 0 : apyPrimeSimulationPercentage,
  );

  return type === 'supply'
    ? totalApyPercentage.plus(estimatePercentage)
    : totalApyPercentage.minus(estimatePercentage);
};
