import { Tooltip, type TooltipProps } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { AssetDistribution } from 'types';
import { cn, formatPercentageToReadableValue } from 'utilities';
import { DistributionGroup } from './DistributionGroup';
import starsIconSrc from './stars.svg';
import type { Distribution } from './types';

export interface BoostBadgeProps extends Omit<TooltipProps, 'children' | 'title'> {
  assetDistributions: AssetDistribution[];
}

export const BoostBadge: React.FC<BoostBadgeProps> = ({
  className,
  assetDistributions,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

  const tokenDistributions = assetDistributions.reduce<Distribution[]>((acc, d) => {
    // Filter out 0% distributions
    if (d.apyPercentage.isEqualTo(0)) {
      return acc;
    }

    if (d.type === 'merkl') {
      const distribution: Distribution = {
        name: d.description || t('marketTable.apy.primeBadge.tooltip.defaultMerklRewardName'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        token: d.token,
        description: (
          <Trans
            i18nKey="marketTable.apy.primeBadge.tooltip.externalRewardDescription"
            components={{
              AppLink: (
                <Link target="_blank" href={d.claimUrl} onClick={e => e.stopPropagation()} />
              ),
            }}
          />
        ),
      };

      return [...acc, distribution];
    }

    if (d.type === 'venus') {
      const distribution: Distribution = {
        name: t('marketTable.apy.primeBadge.tooltip.xvsDistributionName'),
        value: formatPercentageToReadableValue(d.apyPercentage),
        token: d.token,
      };

      return [...acc, distribution];
    }

    return acc;
  }, []);

  return (
    <Tooltip
      className={cn('inline-block align-middle', className)}
      title={
        <DistributionGroup
          title={t('marketTable.apy.primeBadge.tooltip.tokenDistributionsTitle')}
          distributions={tokenDistributions}
        />
      }
      {...otherProps}
    >
      <img src={starsIconSrc} alt={t('marketTable.apy.boostBadge.iconAlt')} className="h-4" />
    </Tooltip>
  );
};
