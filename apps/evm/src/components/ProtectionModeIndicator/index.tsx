import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

export type ProtectionModeVariant = 'icon' | 'label';

export interface ProtectionModeIndicatorProps {
  variant?: ProtectionModeVariant;
  tokenName: string;
  tokenSupplyPriceCents: BigNumber;
  tokenBorrowPriceCents: BigNumber;
  className?: string;
}

export const ProtectionModeIndicator: React.FC<ProtectionModeIndicatorProps> = ({
  variant = 'icon',
  tokenName,
  tokenSupplyPriceCents,
  tokenBorrowPriceCents,
  className,
}) => {
  const { t, Trans } = useTranslation();

  const values = {
    tokenName,
    collateralPrice: formatCentsToReadableValue({
      value: tokenSupplyPriceCents,
      shorten: false,
    }),
    borrowPrice: formatCentsToReadableValue({
      value: tokenBorrowPriceCents,
      shorten: false,
    }),
  };

  const tooltipContent =
    variant === 'label' ? (
      <Trans
        i18nKey="protectionModeIndicator.detailedTooltip"
        components={{
          LineBreak: <br />,
        }}
        values={values}
      />
    ) : (
      t('protectionModeIndicator.detailedTooltip', values)
    );

  return (
    <Tooltip className={cn('inline-flex items-center', className)} content={tooltipContent}>
      {variant === 'label' ? (
        <span className="inline-flex items-center gap-x-1 rounded-full border border-green bg-green/10 px-2 py-0.5 text-xs text-offWhite">
          <Icon name="protectionShield" className="h-4 w-4" />
          <span>{t('protectionModeIndicator.label')}</span>
        </span>
      ) : (
        <Icon name="protectionShield" className="h-[18px] w-[18px]" />
      )}
    </Tooltip>
  );
};
