import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { SenaryButton, Tooltip, type TooltipProps } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { useTranslation } from 'libs/translations';
import { DistributionList, type DistributionListProps } from '../DistributionList';
import { CampaignIcon } from './CampaignIcon';

export interface MerklBadgeProps
  extends Omit<TooltipProps, 'content' | 'children'>,
    Omit<DistributionListProps, 'showEstimatedRewards'> {
  simulatedApyPercentage: BigNumber;
}

export const MerklBadge: React.FC<MerklBadgeProps> = ({
  simulatedApyPercentage,
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  primeSimulationDistribution,
  tokenDistributions,
  pointDistributions,
  vTokenAddress,
  isLiquidityHub,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const readableApy = useFormatPercentageToReadableValue({
    value: simulatedApyPercentage,
  });

  return (
    <Tooltip
      className={cn('inline-flex items-center', className)}
      content={
        <div className="space-y-2">
          <p>{t('apy.merklBadge.tooltip.leadLine', { apy: readableApy })}</p>

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
            isLiquidityHub={isLiquidityHub}
            showEstimatedRewards
          />
        </div>
      }
      {...otherProps}
    >
      <SenaryButton className="border-merkl hover:border-merkl-hover h-6 rounded-full p-1 whitespace-nowrap font-semibold shrink-0">
        <CampaignIcon className="mr-1" />

        <span className="bg-merkl-text bg-clip-text text-transparent">{readableApy}</span>
      </SenaryButton>
    </Tooltip>
  );
};
