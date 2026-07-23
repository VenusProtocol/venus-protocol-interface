import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import type {
  PointDistribution,
  PrimeDistribution,
  PrimeSimulationDistribution,
  Token,
  TokenDistribution,
} from 'types';
import { formatPercentageToReadableValue, getCombinedApy } from 'utilities';
import { BoostTooltip } from './BoostTooltip';
import { PrimeBadge } from './PrimeBadge';

export interface ApyProps {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
  pointDistributions?: PointDistribution[];
  userBalanceTokens?: BigNumber;
  isMuted?: boolean;
  showPrimeSimulation?: boolean;
  className?: string;
}

export const Apy: React.FC<ApyProps> = ({
  type,
  token,
  baseApyPercentage,
  tokenDistributions,
  pointDistributions = [],
  userBalanceTokens,
  isMuted = false,
  showPrimeSimulation = true,
  className,
}) => {
  const combinedApy = getCombinedApy({
    type,
    baseApyPercentage,
    tokenDistributions,
  });
  const readableApy = formatPercentageToReadableValue(combinedApy.totalApyPercentage);
  let primeDistribution: PrimeDistribution | undefined;
  let primeSimulationDistribution: PrimeSimulationDistribution | undefined;
  const activeTokenDistributions = tokenDistributions.filter(distribution => distribution.isActive);

  activeTokenDistributions.forEach(distribution => {
    if (distribution.type === 'prime') {
      primeDistribution = distribution;
    } else if (distribution.type === 'primeSimulation') {
      primeSimulationDistribution = distribution;
    }
  });

  const isPrimeAsset = !!(primeDistribution || primeSimulationDistribution);
  let simulatedApyPercentage: BigNumber | undefined;
  const isApyBoostedByPrime = !!primeDistribution && !!userBalanceTokens?.isGreaterThan(0);

  const isApyBoosted =
    isApyBoostedByPrime ||
    !combinedApy.totalApyPercentage.isEqualTo(baseApyPercentage) ||
    pointDistributions.length > 0;

  if (isPrimeAsset && !isApyBoostedByPrime) {
    simulatedApyPercentage =
      type === 'supply'
        ? combinedApy.totalApyPercentage.plus(combinedApy.apyPrimeSimulationPercentage)
        : combinedApy.totalApyPercentage.minus(combinedApy.apyPrimeSimulationPercentage);
  }

  return (
    <div className={cn('inline-flex gap-1 items-center', isMuted && 'opacity-50', className)}>
      {isApyBoostedByPrime && <PrimeBadge type={type} token={token} />}

      {isApyBoosted ? (
        <BoostTooltip
          tokenDistributions={activeTokenDistributions}
          pointDistributions={pointDistributions}
          token={token}
          type={type}
          baseApyPercentage={baseApyPercentage}
          userBalanceTokens={userBalanceTokens}
          primeApyPercentage={primeDistribution?.apyPercentage}
        >
          <p className="font-semibold text-green whitespace-nowrap">{readableApy}</p>
        </BoostTooltip>
      ) : (
        <p className={cn(isMuted && 'text-grey')}>{readableApy}</p>
      )}

      {showPrimeSimulation && isPrimeAsset && !isApyBoostedByPrime && (
        <PrimeBadge
          type={type}
          token={token}
          simulationReferenceValues={primeSimulationDistribution?.referenceValues}
          simulatedApyPercentage={simulatedApyPercentage}
        />
      )}
    </div>
  );
};
