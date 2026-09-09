import BigNumber from 'bignumber.js';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type {
  PointDistribution,
  PrimeSimulationDistribution,
  Token,
  TokenDistribution,
} from 'types';
import {
  formatCentsToReadableValue,
  formatDistributionApyToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { CalculatorLink } from '../PrimeBadge/CalculatorLink';
import { SimulationText } from '../PrimeBadge/SimulationText';
import { Distribution, type DistributionProps } from './Distribution';

export interface DistributionListProps {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
  pointDistributions: PointDistribution[];
  userBalanceTokens?: BigNumber;
  primeApyPercentage?: BigNumber;
  primeSimulationDistribution?: PrimeSimulationDistribution;
  // Also lists the rewards the user has not qualified for yet, at their advertised rate
  showEstimatedRewards?: boolean;
}

export const DistributionList: React.FC<DistributionListProps> = ({
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  primeSimulationDistribution,
  tokenDistributions,
  pointDistributions,
  showEstimatedRewards = false,
}) => {
  const { t, Trans } = useTranslation();

  const formatDistributionApy = (apyPercentage: BigNumber) =>
    formatDistributionApyToReadableValue({ apyPercentage, type });

  const renderExternalRewardDescription = (claimUrl: string) => (
    <Trans
      i18nKey="apy.boost.tooltip.externalRewardDescription"
      components={{
        AppLink: <Link target="_blank" href={claimUrl} onClick={e => e.stopPropagation()} />,
      }}
    />
  );

  // A market can run several campaigns at once, so rows carry their own key
  const listItems: (DistributionProps & { key: string })[] = [
    {
      key: 'base',
      name:
        type === 'supply'
          ? t('apy.boost.tooltip.supplyApy.name')
          : t('apy.boost.tooltip.borrowApy.name'),
      value: formatPercentageToReadableValue(baseApyPercentage),
      logoSrc: token.iconSrc,
      description:
        type === 'supply'
          ? t('apy.boost.tooltip.supplyApy.description')
          : t('apy.boost.tooltip.borrowApy.description'),
    },
  ];

  tokenDistributions.forEach(d => {
    const collateralGate = d.type === 'merkl' ? d.collateralGate : undefined;
    const isMissingRequiredCollateral = !!collateralGate && !collateralGate.isUserEligible;

    // 0% rows are noise, unless we are advertising a rate the user has not qualified for
    if (d.apyPercentage.isEqualTo(0) && !(isMissingRequiredCollateral && showEstimatedRewards)) {
      return;
    }

    if (d.type === 'merkl') {
      // The rate is quoted against this amount, which the API does not always serve
      const { eligibleBorrowAmountUsd } = d.rewardDetails;

      const distribution = {
        key: d.rewardDetails.merklCampaignIdentifier,
        name: d.rewardDetails.description || t('apy.boost.tooltip.defaultMerklRewardName'),
        value: formatDistributionApy(
          isMissingRequiredCollateral ? collateralGate.maxApyPercentage : d.apyPercentage,
        ),
        logoSrc: d.token.iconSrc,
        description: isMissingRequiredCollateral
          ? t('apy.boost.tooltip.collateralGatedMerklReward.description', {
              amount: formatCentsToReadableValue({
                value: eligibleBorrowAmountUsd
                  ? new BigNumber(eligibleBorrowAmountUsd).multipliedBy(100)
                  : undefined,
              }),
              tokenSymbol: token.symbol,
            })
          : renderExternalRewardDescription(d.rewardDetails.claimUrl),
      };

      return listItems.push(distribution);
    }

    if (d.type === 'venus') {
      const distribution = {
        key: 'venus',
        name: t('apy.boost.tooltip.xvsDistribution.name'),
        description: t('apy.boost.tooltip.xvsDistribution.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'intrinsic') {
      const distribution = {
        key: 'intrinsic',
        name: t('apy.boost.tooltip.intrinsicApy.name'),
        description: t('apy.boost.tooltip.intrinsicApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'off-chain') {
      const distribution = {
        key: 'off-chain',
        name: t('apy.boost.tooltip.offChainApy.name'),
        description: t('apy.boost.tooltip.offChainApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'yield-to-maturity') {
      const distribution = {
        key: 'yield-to-maturity',
        name: t('apy.boost.tooltip.yieldToMaturityApy.name'),
        description: t('apy.boost.tooltip.yieldToMaturityApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'liquidity-hub-intrinsic') {
      const distribution = {
        key: 'liquidity-hub-intrinsic',
        name: t('apy.boost.tooltip.liquidityHubIntrinsicApy.name'),
        description: (
          <Trans
            i18nKey="apy.boost.tooltip.liquidityHubIntrinsicApy.description"
            components={{
              AppLink: <Link to={routes.liquidityHubs.path} onClick={e => e.stopPropagation()} />,
            }}
          />
        ),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }
  });

  if (primeApyPercentage && userBalanceTokens?.isGreaterThan(0)) {
    listItems.push({
      key: 'prime',
      name: t('apy.boost.tooltip.primeDistribution.name'),
      description: t('apy.boost.tooltip.primeDistribution.description'),
      value: formatDistributionApy(primeApyPercentage),
      logoSrc: token.iconSrc,
    });
  } else if (showEstimatedRewards && primeSimulationDistribution?.apyPercentage.isGreaterThan(0)) {
    listItems.push({
      key: 'primeSimulation',
      name: t('apy.boost.tooltip.primeDistribution.name'),
      description: (
        <>
          <p>
            <SimulationText
              token={token}
              type={type}
              referenceValues={primeSimulationDistribution.referenceValues}
            />
          </p>

          <CalculatorLink />
        </>
      ),
      value: formatDistributionApy(primeSimulationDistribution.apyPercentage),
      logoSrc: token.iconSrc,
    });
  }

  pointDistributions.forEach(p =>
    listItems.push({
      key: `points-${p.title}`,
      name: p.title,
      value: p.incentive,
      logoSrc: p.logoUrl,
      description:
        !!p.description || !!p.extraInfoUrl ? (
          <div>
            <p>{p.description}</p>

            {!!p.extraInfoUrl && (
              <Link href={p.extraInfoUrl} onClick={e => e.stopPropagation()} target="_blank">
                {t('apy.boost.tooltip.pointDistribution.learnMore')}
              </Link>
            )}
          </div>
        ) : undefined,
    }),
  );

  return (
    <div className="space-y-2 min-w-50">
      {listItems.map(({ key, ...item }) => (
        <Distribution key={key} {...item} />
      ))}
    </div>
  );
};
