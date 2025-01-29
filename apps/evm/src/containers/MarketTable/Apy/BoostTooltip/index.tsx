import type BigNumber from 'bignumber.js';
import { Tooltip, type TooltipProps } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { AssetDistribution, Token } from 'types';
import { cn, formatPercentageToReadableValue } from 'utilities';
import { DistributionGroup } from './DistributionGroup';
import starsIconSrc from './stars.svg';
import type { Distribution } from './types';

export interface BoostTooltipProps extends Omit<TooltipProps, 'content'> {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  assetDistributions: AssetDistribution[];
  primeApyPercentage?: BigNumber;
}

export const BoostTooltip: React.FC<BoostTooltipProps> = ({
  className,
  type,
  token,
  baseApyPercentage,
  primeApyPercentage,
  assetDistributions,
  children,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

  const tokenDistributions: Distribution[] = [
    {
      name:
        type === 'supply'
          ? t('marketTable.apy.boost.tooltip.baseSupplyApyLabel')
          : t('marketTable.apy.boost.tooltip.baseBorrowApyLabel'),
      value: formatPercentageToReadableValue(baseApyPercentage),
      token,
    },
  ];

  assetDistributions.forEach(d => {
    // Filter out 0% distributions
    if (d.apyPercentage.isEqualTo(0)) {
      return;
    }

    if (d.type === 'merkl') {
      const distribution: Distribution = {
        name: d.description || t('marketTable.apy.boost.tooltip.defaultMerklRewardName'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        token: d.token,
        description: (
          <Trans
            i18nKey="marketTable.apy.boost.tooltip.externalRewardDescription"
            components={{
              AppLink: (
                <Link target="_blank" href={d.claimUrl} onClick={e => e.stopPropagation()} />
              ),
            }}
          />
        ),
      };

      return tokenDistributions.push(distribution);
    }

    if (d.type === 'venus') {
      const distribution: Distribution = {
        name: t('marketTable.apy.boost.tooltip.xvsDistributionName'),
        description: t('marketTable.apy.boost.tooltip.xvsDistributionDescription'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        token: d.token,
      };

      return tokenDistributions.push(distribution);
    }
  }, []);

  // Add Prime distribution
  if (primeApyPercentage?.isGreaterThan(0)) {
    tokenDistributions.push({
      name: t('marketTable.apy.boost.tooltip.primeDistributionName'),
      description: t('marketTable.apy.boost.tooltip.primeDistributionDescription'),
      value: formatPercentageToReadableValue(primeApyPercentage),
      token,
    });
  }

  return (
    <Tooltip
      className={cn('inline-flex items-center gap-1', className)}
      content={
        <div className="space-y-2">
          <DistributionGroup distributions={tokenDistributions} />
        </div>
      }
      {...otherProps}
    >
      <img src={starsIconSrc} alt={t('marketTable.apy.boost.iconAlt')} className="h-4" />

      {children}
    </Tooltip>
  );
};
