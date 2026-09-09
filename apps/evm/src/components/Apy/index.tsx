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
import { MerklBadge } from './MerklBadge';
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
  // The Prime page already identifies itself, so it turns the leading Prime icon off
  showPrimeIcon?: boolean;
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
  showPrimeIcon = true,
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
  const gatedMerklApyPercentages: BigNumber[] = [];
  const activeTokenDistributions = tokenDistributions.filter(distribution => distribution.isActive);

  activeTokenDistributions.forEach(distribution => {
    if (distribution.type === 'prime') {
      primeDistribution = distribution;
    } else if (distribution.type === 'primeSimulation') {
      primeSimulationDistribution = distribution;
    } else if (
      distribution.type === 'merkl' &&
      distribution.collateralGate?.isUserEligible === false
    ) {
      gatedMerklApyPercentages.push(distribution.collateralGate.maxApyPercentage);
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

  const shownPrimeSimulationDistribution =
    showPrimeSimulation && !isApyBoostedByPrime ? primeSimulationDistribution : undefined;

  const distributionListProps = {
    type,
    token,
    baseApyPercentage,
    userBalanceTokens,
    tokenDistributions: activeTokenDistributions,
    pointDistributions,
    primeApyPercentage: primeDistribution?.apyPercentage,
    primeSimulationDistribution: shownPrimeSimulationDistribution,
  };

  // Only one badge fits: the campaign takes the slot until the user qualifies for it
  let badgeDom: React.ReactNode;

  if (gatedMerklApyPercentages.length > 0) {
    // The badge advertises the APY once qualified, so every unearned reward comes off it
    const missedApyPercentage = gatedMerklApyPercentages
      .reduce((acc, apyPercentage) => acc.plus(apyPercentage))
      .plus(shownPrimeSimulationDistribution?.apyPercentage ?? 0);

    badgeDom = (
      <MerklBadge
        className="shrink-0"
        simulatedApyPercentage={combinedApy.totalApyPercentage.minus(missedApyPercentage)}
        {...distributionListProps}
      />
    );
  } else if (showPrimeSimulation && isPrimeAsset && !isApyBoostedByPrime) {
    badgeDom = (
      <PrimeBadge
        className="shrink-0"
        type={type}
        token={token}
        simulationReferenceValues={primeSimulationDistribution?.referenceValues}
        simulatedApyPercentage={simulatedApyPercentage}
      />
    );
  }

  return (
    <div
      className={cn('inline-flex gap-1 items-center flex-wrap', isMuted && 'opacity-50', className)}
    >
      {isApyBoostedByPrime && showPrimeIcon && (
        <PrimeBadge className="shrink-0" type={type} token={token} />
      )}

      {isApyBoosted ? (
        <BoostTooltip {...distributionListProps}>
          <p className="font-semibold text-green whitespace-nowrap">{readableApy}</p>
        </BoostTooltip>
      ) : (
        <p className={cn('whitespace-nowrap shrink-0', isMuted && 'text-grey')}>{readableApy}</p>
      )}

      {badgeDom}
    </div>
  );
};
