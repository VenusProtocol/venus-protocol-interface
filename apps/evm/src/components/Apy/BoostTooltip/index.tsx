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
  tokenDistributions: TokenDistribution[];
  pointDistributions: PointDistribution[];
  primeApyPercentage?: BigNumber;
}

export const BoostTooltip: React.FC<BoostTooltipProps> = ({
  className,
  type,
  token,
  baseApyPercentage,
  primeApyPercentage,
  tokenDistributions,
  pointDistributions,
  children,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

  const lisItems: DistributionProps[] = [
    {
      name:
        type === 'supply'
          ? t('apy.boost.tooltip.baseSupplyApyLabel')
          : t('apy.boost.tooltip.baseBorrowApyLabel'),
      value: formatPercentageToReadableValue(baseApyPercentage),
      logoSrc: token.asset,
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
        logoSrc: d.token.asset,
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

      return lisItems.push(distribution);
    }

    if (d.type === 'venus') {
      const distribution: DistributionProps = {
        name: t('apy.boost.tooltip.xvsDistribution.name'),
        description: t('apy.boost.tooltip.xvsDistribution.description'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        logoSrc: d.token.asset,
      };

      return lisItems.push(distribution);
    }
  }, []);

  // Add Prime distribution
  if (primeApyPercentage?.isGreaterThan(0)) {
    lisItems.push({
      name: t('apy.boost.tooltip.primeDistribution.name'),
      description: t('apy.boost.tooltip.primeDistribution.description'),
      value: formatPercentageToReadableValue(primeApyPercentage),
      logoSrc: token.asset,
    });
  }

  pointDistributions.forEach(p =>
    lisItems.push({
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
          {lisItems.map(t => (
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
