import type BigNumber from 'bignumber.js';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import type { Asset, PrimeDistribution, PrimeSimulationDistribution } from 'types';
import { cn, getCombinedDistributionApys } from 'utilities';
import type { ColumnKey } from '../types';
import { BoostBadge } from './BoostBadge';
import { PrimeBadge } from './PrimeBadge';

export interface ApyProps {
  asset: Asset;
  column: ColumnKey;
  className?: string;
}

export const Apy: React.FC<ApyProps> = ({ asset, column, className, ...otherProps }) => {
  const type = column === 'supplyApy' || column === 'labeledSupplyApy' ? 'supply' : 'borrow';

  const combinedDistributionApys = getCombinedDistributionApys({ asset });

  const baseApyPercentage =
    type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage;

  const boostedApyPercentage =
    type === 'supply'
      ? combinedDistributionApys.totalSupplyApyPercentage
      : combinedDistributionApys.totalBorrowApyPercentage;

  const isApyBoosted = !boostedApyPercentage.isEqualTo(baseApyPercentage);

  const readableApy = useFormatPercentageToReadableValue({
    value: boostedApyPercentage,
  });

  let primeDistribution: PrimeDistribution | undefined;
  let primeSimulationDistribution: PrimeSimulationDistribution | undefined;
  const distributions = type === 'supply' ? asset.supplyDistributions : asset.borrowDistributions;

  let shouldShowBoostBadge = false;

  distributions.forEach(distribution => {
    if (distribution.type === 'prime') {
      primeDistribution = distribution;
    } else if (distribution.type === 'primeSimulation') {
      primeSimulationDistribution = distribution;
    } else if (!distribution.apyPercentage.isEqualTo(0)) {
      shouldShowBoostBadge = true;
    }
  });

  const isPrimeAsset = !!(primeDistribution || primeSimulationDistribution);

  let simulatedApyPercentage: BigNumber | undefined;

  if (isPrimeAsset && (!primeDistribution || primeDistribution.apyPercentage.isEqualTo(0))) {
    simulatedApyPercentage =
      type === 'supply'
        ? combinedDistributionApys.totalSupplyApyPercentage.plus(
            combinedDistributionApys.supplyApyPrimeSimulationPercentage,
          )
        : combinedDistributionApys.totalBorrowApyPercentage.plus(
            combinedDistributionApys.borrowApyPrimeSimulationPercentage,
          );
  }

  return (
    <div {...otherProps} className={cn('inline-flex gap-1 items-center', className)}>
      {shouldShowBoostBadge && (
        <BoostBadge
          assetDistributions={
            type === 'supply' ? asset.supplyDistributions : asset.borrowDistributions
          }
        />
      )}

      <div className={cn(isApyBoosted && 'font-semibold text-green')}>{readableApy}</div>

      {isPrimeAsset && (
        <PrimeBadge
          token={asset.vToken.underlyingToken}
          simulationReferenceValues={primeSimulationDistribution?.referenceValues}
          simulatedApyPercentage={simulatedApyPercentage}
        />
      )}
    </div>
  );
};
