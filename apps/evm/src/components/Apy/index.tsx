import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import type { Asset, PrimeDistribution, PrimeSimulationDistribution } from 'types';
import { formatPercentageToReadableValue, getCombinedDistributionApys } from 'utilities';
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

  const userBalanceTokens =
    type === 'supply' ? asset.userSupplyBalanceTokens : asset.userBorrowBalanceTokens;

  const readableApy = formatPercentageToReadableValue(boostedApyPercentage);

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
  const shouldBeGreyedOut = type === 'borrow' && !asset.isBorrowableByUser;

  let simulatedApyPercentage: BigNumber | undefined;
  const isApyBoostedByPrime = !!primeDistribution && userBalanceTokens.isGreaterThan(0);

  const isApyBoosted =
    isApyBoostedByPrime ||
    !boostedApyPercentage.isEqualTo(baseApyPercentage) ||
    pointDistributions.length > 0;

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
    <div
      className={cn('inline-flex gap-1 items-center', shouldBeGreyedOut && 'opacity-50', className)}
    >
      {isApyBoostedByPrime && <PrimeBadge type={type} token={asset.vToken.underlyingToken} />}

      {isApyBoosted ? (
        <BoostTooltip
          tokenDistributions={tokenDistributions}
          pointDistributions={pointDistributions}
          token={asset.vToken.underlyingToken}
          type={type}
          baseApyPercentage={baseApyPercentage}
          userBalanceTokens={userBalanceTokens}
          primeApyPercentage={primeDistribution?.apyPercentage}
        >
          <p className="font-semibold text-green whitespace-nowrap">{readableApy}</p>
        </BoostTooltip>
      ) : (
        <p className={cn(shouldBeGreyedOut && 'text-grey')}>{readableApy}</p>
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
