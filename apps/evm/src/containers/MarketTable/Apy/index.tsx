import type BigNumber from 'bignumber.js';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import type { Asset, PrimeDistribution, PrimeSimulationDistribution } from 'types';
import { getCombinedDistributionApys } from 'utilities';
import type { ColumnKey } from '../types';
import { BoostTooltip } from './BoostTooltip';
import { PrimeBadge } from './PrimeBadge';

export interface ApyProps {
  asset: Asset;
  column: ColumnKey;
  className?: string;
}

export const Apy: React.FC<ApyProps> = ({ asset, column }) => {
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

  distributions.forEach(distribution => {
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
    <div className="inline-flex gap-1 items-center">
      {isApyBoostedByPrime && <PrimeBadge type={type} token={asset.vToken.underlyingToken} />}

      {isApyBoosted ? (
        <BoostTooltip
          assetDistributions={distributions}
          token={asset.vToken.underlyingToken}
          type={type}
          baseApyPercentage={
            type === 'supply' ? asset.supplyApyPercentage : asset.borrowApyPercentage
          }
          primeApyPercentage={primeDistribution?.apyPercentage}
        >
          <p className="font-semibold text-green">{readableApy}</p>
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
