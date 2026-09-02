import type BigNumber from 'bignumber.js';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { PointDistribution, Token, TokenDistribution } from 'types';
import { formatDistributionApyToReadableValue, formatPercentageToReadableValue } from 'utilities';
import { Distribution, type DistributionProps } from './Distribution';

export interface DistributionListProps {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
  pointDistributions: PointDistribution[];
  userBalanceTokens?: BigNumber;
  primeApyPercentage?: BigNumber;
}

export const DistributionList: React.FC<DistributionListProps> = ({
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  tokenDistributions,
  pointDistributions,
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

  const listItems: DistributionProps[] = [
    {
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

    // Filter out 0% distributions, unless the user is only missing the required collateral
    if (d.apyPercentage.isEqualTo(0) && !isMissingRequiredCollateral) {
      return;
    }

    if (d.type === 'merkl') {
      const distribution: DistributionProps = {
        name: d.rewardDetails.description || t('apy.boost.tooltip.defaultMerklRewardName'),
        value: formatDistributionApy(
          isMissingRequiredCollateral ? collateralGate.maxApyPercentage : d.apyPercentage,
        ),
        logoSrc: d.token.iconSrc,
        description: isMissingRequiredCollateral ? (
          <>
            <p>
              {t('apy.boost.tooltip.collateralGatedMerklReward.description', {
                tokenSymbol: token.symbol,
              })}
            </p>

            <p>{renderExternalRewardDescription(d.rewardDetails.claimUrl)}</p>
          </>
        ) : (
          renderExternalRewardDescription(d.rewardDetails.claimUrl)
        ),
      };

      return listItems.push(distribution);
    }

    if (d.type === 'venus') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.xvsDistribution.name'),
        description: t('apy.boost.tooltip.xvsDistribution.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'intrinsic') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.intrinsicApy.name'),
        description: t('apy.boost.tooltip.intrinsicApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'off-chain') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.offChainApy.name'),
        description: t('apy.boost.tooltip.offChainApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'yield-to-maturity') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.yieldToMaturityApy.name'),
        description: t('apy.boost.tooltip.yieldToMaturityApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'liquidity-hub-intrinsic') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.liquidityHubIntrinsicApy.name'),
        description: t('apy.boost.tooltip.liquidityHubIntrinsicApy.description'),
        value: formatDistributionApy(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }
  });

  // Add Prime distribution
  if (primeApyPercentage && userBalanceTokens?.isGreaterThan(0)) {
    listItems.push({
      name: t('apy.boost.tooltip.primeDistribution.name'),
      description: t('apy.boost.tooltip.primeDistribution.description'),
      value: formatDistributionApy(primeApyPercentage),
      logoSrc: token.iconSrc,
    });
  }

  pointDistributions.forEach(p =>
    listItems.push({
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
      {listItems.map(item => (
        <Distribution key={`${item.name}-${item.logoSrc}-${item.description}`} {...item} />
      ))}
    </div>
  );
};
