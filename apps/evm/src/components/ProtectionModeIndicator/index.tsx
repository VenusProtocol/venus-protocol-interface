import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

export type ProtectionModeVariant = 'icon' | 'label';

export interface ProtectionModeIndicatorProps {
  variant?: ProtectionModeVariant;
  tooltip?: React.ReactNode;
  tokenName?: string;
  className?: string;
}

export const ProtectionModeIndicator: React.FC<ProtectionModeIndicatorProps> = ({
  variant = 'icon',
  tooltip,
  tokenName,
  className,
}) => {
  const { t } = useTranslation();

  const tooltipContent = tooltip ?? t('marketTable.assetColumn.protectionMode', { tokenName });

  if (variant === 'label') {
    return (
      <Tooltip className={cn('inline-flex items-center', className)} content={tooltipContent}>
        <span className="inline-flex items-center gap-x-1 rounded-full border border-green bg-green/10 px-2 py-0.5 text-xs text-offWhite">
          <Icon name="protectionShield" className="h-4 w-4" />
          <span>{t('protectionModeIndicator.label')}</span>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip className={cn('inline-flex items-center', className)} content={tooltipContent}>
      <Icon name="protectionShield" className="h-[18px] w-[18px]" />
    </Tooltip>
  );
};
