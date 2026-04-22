import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { VENUS_PROTECTION_MODE_DOC_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

export type ProtectionModeVariant = 'icon' | 'label';

export type ProtectionModeTooltipType = 'supply' | 'borrow' | 'list' | 'pair';

export interface ProtectionModeIndicatorProps {
  variant?: ProtectionModeVariant;
  tooltipType?: ProtectionModeTooltipType;
  tokenName: string;
  tokenSupplyPriceCents?: BigNumber;
  tokenBorrowPriceCents?: BigNumber;
  userSupplyBalanceCents?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
  className?: string;
}

const LearnMoreLink = (
  // biome-ignore lint/a11y/useAnchorContent: content is provided by Trans
  <a
    href={VENUS_PROTECTION_MODE_DOC_URL}
    className="text-blue underline"
    target="_blank"
    rel="noopener noreferrer"
  />
);

export const ProtectionModeIndicator: React.FC<ProtectionModeIndicatorProps> = ({
  variant = 'icon',
  tooltipType,
  tokenName,
  tokenSupplyPriceCents,
  tokenBorrowPriceCents,
  userSupplyBalanceCents,
  userBorrowBalanceCents,
  className,
}) => {
  const { t, Trans } = useTranslation();

  let tooltipContent: React.ReactNode;

  switch (tooltipType) {
    case 'supply':
      tooltipContent = t('marketTable.assetColumn.protectionModeSupply', {
        protectedValue: formatCentsToReadableValue({
          value: userSupplyBalanceCents,
        }),
      });
      break;
    case 'borrow':
      tooltipContent = t('marketTable.assetColumn.protectionModeBorrow', {
        protectedValue: formatCentsToReadableValue({
          value: userBorrowBalanceCents,
        }),
      });
      break;
    case 'pair':
      tooltipContent = (
        <Trans
          i18nKey="marketTable.assetColumn.protectionModePair"
          components={{ LearnMore: LearnMoreLink }}
          values={{ tokenName }}
        />
      );
      break;
    case 'list':
      tooltipContent = (
        <Trans
          i18nKey="marketTable.assetColumn.protectionMode"
          components={{ LearnMore: LearnMoreLink }}
          values={{ tokenName }}
        />
      );
      break;
    default:
      tooltipContent = (
        <Trans
          i18nKey="protectionModeIndicator.detailedTooltip"
          components={{
            LineBreak: <br />,
          }}
          values={{
            tokenName,
            collateralPrice: formatCentsToReadableValue({
              value: tokenSupplyPriceCents,
              shorten: false,
            }),
            borrowPrice: formatCentsToReadableValue({
              value: tokenBorrowPriceCents,
              shorten: false,
            }),
          }}
        />
      );
      break;
  }

  return (
    <Tooltip className={cn('inline-flex items-center', className)} content={tooltipContent}>
      {variant === 'label' ? (
        <span className="inline-flex items-center gap-x-2.5 rounded-full border border-green bg-green/10 px-3 h-[30px] text-sm text-offWhite">
          <Icon name="protectionShield" className="h-4 w-4" />
          <span>{t('protectionModeIndicator.label')}</span>
        </span>
      ) : (
        <Icon name="protectionShield" className="h-[18px] w-[18px]" />
      )}
    </Tooltip>
  );
};
