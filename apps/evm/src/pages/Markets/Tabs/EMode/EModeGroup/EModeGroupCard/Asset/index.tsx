import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { LabeledInlineContent, MarketStatus, TokenIconWithSymbol } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface AssetProps {
  eModeAssetSettings: EModeAssetSettings;
  isEModeGroupActive: boolean;
  poolComptrollerAddress: Address;
  className?: string;
}

export const Asset: React.FC<AssetProps> = ({
  eModeAssetSettings,
  isEModeGroupActive,
  poolComptrollerAddress,
  className,
}) => {
  const { t } = useTranslation();
  const { formatTo } = useFormatTo();

  const to = formatTo({
    to: routes.market.path
      .replace(':poolComptrollerAddress', poolComptrollerAddress)
      .replace(':vTokenAddress', eModeAssetSettings.vToken.address),
  });

  const dataListItems = [
    {
      label: t('markets.eMode.table.card.rows.maxLtv'),
      value: formatPercentageToReadableValue(eModeAssetSettings.collateralFactor * 100),
    },
    {
      label: t('markets.eMode.table.card.rows.liquidationThreshold'),
      value: formatPercentageToReadableValue(eModeAssetSettings.liquidationThresholdPercentage),
    },
    {
      label: t('markets.eMode.table.card.rows.liquidationPenalty'),
      value: formatPercentageToReadableValue(eModeAssetSettings.liquidationPenaltyPercentage),
    },
  ];

  return (
    <Link
      className={cn('space-y-3 block no-underline text-inherit hover:no-underline', className)}
      to={to}
    >
      <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <TokenIconWithSymbol
          token={eModeAssetSettings.vToken.underlyingToken}
          className="shrink-0"
        />

        <MarketStatus
          className={cn(!isEModeGroupActive && 'opacity-50')}
          isBorrowable={eModeAssetSettings.isBorrowable}
          canBeCollateral={eModeAssetSettings.collateralFactor > 0}
        />
      </div>

      <div className="space-y-2">
        {dataListItems.map(item => (
          <LabeledInlineContent key={item.label} label={item.label}>
            <span className={cn(!isEModeGroupActive && 'text-grey opacity-50')}>{item.value}</span>
          </LabeledInlineContent>
        ))}
      </div>
    </Link>
  );
};
