import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import { Tooltip, type TooltipProps } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { PointDistribution, Token, TokenDistribution } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { Distribution, type DistributionProps } from './Distribution';
import starsIconSrc from './stars.svg';

export interface BoostTooltipProps extends Omit<TooltipProps, 'content'> {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  userBalanceTokens: BigNumber;
  tokenDistributions: TokenDistribution[];
  pointDistributions: PointDistribution[];
  primeApyPercentage?: BigNumber;
}

export const BoostTooltip: React.FC<BoostTooltipProps> = ({
  className,
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  tokenDistributions,
  pointDistributions,
  children,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

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
    // Filter out 0% distributions
    if (d.apyPercentage.isEqualTo(0)) {
      return;
    }

    if (d.type === 'merkl') {
      const distribution: DistributionProps = {
        name: d.rewardDetails.description || t('apy.boost.tooltip.defaultMerklRewardName'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.iconSrc,
        description: (
          <Trans
            i18nKey="apy.boost.tooltip.externalRewardDescription"
            components={{
              AppLink: (
                <Link
                  target="_blank"
                  href={d.rewardDetails.claimUrl}
                  onClick={e => e.stopPropagation()}
                />
              ),
            }}
          />
        ),
      };

      return listItems.push(distribution);
    }

    if (d.type === 'venus') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.xvsDistribution.name'),
        description: t('apy.boost.tooltip.xvsDistribution.description'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'intrinsic') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.intrinsicApy.name'),
        description: t('apy.boost.tooltip.intrinsicApy.description'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'off-chain') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.offChainApy.name'),
        description: t('apy.boost.tooltip.offChainApy.description'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }

    if (d.type === 'yield-to-maturity') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.yieldToMaturityApy.name'),
        description: t('apy.boost.tooltip.yieldToMaturityApy.description'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.iconSrc,
      };

      return listItems.push(distribution);
    }
  }, []);

  // Add Prime distribution
  if (primeApyPercentage && userBalanceTokens.isGreaterThan(0)) {
    listItems.push({
      name: t('apy.boost.tooltip.primeDistribution.name'),
      description: t('apy.boost.tooltip.primeDistribution.description'),
      value: formatPercentageToReadableValue(primeApyPercentage),
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
    <Tooltip
      className={cn('inline-flex items-center gap-1', className)}
      content={
        <div className="space-y-2 min-w-50">
          {listItems.map(t => (
            <Distribution key={`${t.name}-${t.logoSrc}-${t.description}`} {...t} />
          ))}
        </div>
      }
      {...otherProps}
    >
      <img src={starsIconSrc} alt={t('apy.boost.iconAlt')} className="h-4" />

      {children}
    </Tooltip>
  );
};
