import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import type { Asset, PrimeDistribution, PrimeSimulationDistribution } from 'types';
import { getCombinedDistributionApys } from 'utilities';
import { BoostTooltip } from './BoostTooltip';
import { PrimeBadge } from './PrimeBadge';

export interface ApyProps {
  asset: Asset;
  type: 'supply' | 'borrow';
  className?: string;
}

export const Apy: React.FC<ApyProps> = ({ asset, type, className }) => {
  const combinedDistributionApys = getCombinedDistributionApys({ asset });

  const baseApyPercentage =
    type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage;

  const boostedApyPercentage =
    type === 'supply'
      ? combinedDistributionApys.totalSupplyApyPercentage
      : combinedDistributionApys.totalBorrowApyPercentage;

  const pointDistributions =
    type === 'supply' ? asset.supplyPointDistributions : asset.borrowPointDistributions;

  const isApyBoosted =
    !boostedApyPercentage.isEqualTo(baseApyPercentage) || pointDistributions.length > 0;

  const readableApy = useFormatPercentageToReadableValue({
    value: boostedApyPercentage,
  });

  let primeDistribution: PrimeDistribution | undefined;
  let primeSimulationDistribution: PrimeSimulationDistribution | undefined;
  const tokenDistributions =
    type === 'supply'
      ? asset.supplyTokenDistributions.filter(d => d.isActive)
      : asset.borrowTokenDistributions.filter(d => d.isActive);

  tokenDistributions.forEach(distribution => {
    if (distribution.type === 'prime') {
      primeDistribution = distribution;
    } else if (distribution.type === 'primeSimulation') {
      primeSimulationDistribution = distribution;
    }
  });

  const isPrimeAsset = !!(primeDistribution || primeSimulationDistribution);

  let simulatedApyPercentage: BigNumber | undefined;
  const isApyBoostedByPrime = primeDistribution && !primeDistribution.apyPercentage.isEqualTo(0);

  if (isPrimeAsset && !isApyBoostedByPrime) {
    simulatedApyPercentage =
      type === 'supply'
        ? combinedDistributionApys.totalSupplyApyPercentage.plus(
            combinedDistributionApys.supplyApyPrimeSimulationPercentage,
          )
        : combinedDistributionApys.totalBorrowApyPercentage.minus(
            combinedDistributionApys.borrowApyPrimeSimulationPercentage,
          );
  }

  return (
    <div className={cn('inline-flex gap-1 items-center', className)}>
      {isApyBoostedByPrime && <PrimeBadge type={type} token={asset.vToken.underlyingToken} />}

      {isApyBoosted ? (
        <BoostTooltip
          tokenDistributions={tokenDistributions}
          pointDistributions={pointDistributions}
          token={asset.vToken.underlyingToken}
          type={type}
          baseApyPercentage={
            type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage
          }
          primeApyPercentage={primeDistribution?.apyPercentage}
        >
          <p className="font-semibold text-green whitespace-nowrap">{readableApy}</p>
        </BoostTooltip>
      ) : (
        <p>{readableApy}</p>
      )}

      {isPrimeAsset && !isApyBoostedByPrime && (
        <PrimeBadge
          type={type}
          token={asset.vToken.underlyingToken}
          simulationReferenceValues={primeSimulationDistribution?.referenceValues}
          simulatedApyPercentage={simulatedApyPercentage}
        />
      )}
    </div>
  );
};
