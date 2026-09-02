import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { SenaryButton, Tooltip, type TooltipProps } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { useTranslation } from 'libs/translations';
import { DistributionList, type DistributionListProps } from '../DistributionList';
import { MerklIcon } from './MerklIcon';

export interface MerklBadgeProps
  extends Omit<TooltipProps, 'content' | 'children'>,
    DistributionListProps {
  simulatedApyPercentage: BigNumber;
}

export const MerklBadge: React.FC<MerklBadgeProps> = ({
  simulatedApyPercentage,
  type,
  token,
  baseApyPercentage,
  userBalanceTokens,
  primeApyPercentage,
  tokenDistributions,
  pointDistributions,
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
            tokenDistributions={tokenDistributions}
            pointDistributions={pointDistributions}
          />
        </div>
      }
      {...otherProps}
    >
      <SenaryButton className="border-[#85ccff] hover:border-[#acdcff] h-6 rounded-full p-1 whitespace-nowrap shrink-0">
        <MerklIcon className="mr-1" />

        <span className="bg-[linear-gradient(153deg,#4eaaec_9%,#acdcff_48%,#5caae2_87%)] bg-clip-text text-transparent">
          {readableApy}
        </span>
      </SenaryButton>
    </Tooltip>
  );
};
