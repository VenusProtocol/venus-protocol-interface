import { cn } from '@venusprotocol/ui';
import { Tooltip, type TooltipProps } from 'components';
import { useTranslation } from 'libs/translations';
import { DistributionList, type DistributionListProps } from '../DistributionList';
import starsIconSrc from './stars.svg';

export interface BoostTooltipProps
  extends Omit<TooltipProps, 'content'>,
    Omit<DistributionListProps, 'showEstimatedRewards'> {}

export const BoostTooltip: React.FC<BoostTooltipProps> = ({
  className,
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  primeSimulationDistribution,
  tokenDistributions,
  pointDistributions,
  vTokenAddress,
  children,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      className={cn('inline-flex items-center gap-1', className)}
      content={
        <DistributionList
          type={type}
          token={token}
          baseApyPercentage={baseApyPercentage}
          userBalanceTokens={userBalanceTokens}
          primeApyPercentage={primeApyPercentage}
          primeSimulationDistribution={primeSimulationDistribution}
          tokenDistributions={tokenDistributions}
          pointDistributions={pointDistributions}
          vTokenAddress={vTokenAddress}
        />
      }
      {...otherProps}
    >
      <img src={starsIconSrc} alt={t('apy.boost.iconAlt')} className="h-4" />

      {children}
    </Tooltip>
  );
};
