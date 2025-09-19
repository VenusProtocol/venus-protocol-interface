import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import { Icon, LabeledInlineContent, LayeredValues, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface AssetProps {
  liquidityTokens: BigNumber;
  liquidityCents: number;
  eModeAssetSettings: EModeAssetSettings;
  className?: string;
}

export const Asset: React.FC<AssetProps> = ({
  liquidityCents,
  liquidityTokens,
  eModeAssetSettings,
  className,
}) => {
  const { t } = useTranslation();

  const dataListItems = [
    {
      label: t('pool.eMode.table.card.rows.liquidity'),
      value: (
        <LayeredValues
          className="text-right"
          topValue={formatTokensToReadableValue({
            value: liquidityTokens,
            token: eModeAssetSettings.vToken.underlyingToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: liquidityCents,
          })}
        />
      ),
    },
    {
      label: t('pool.eMode.table.card.rows.maxLtv'),
      value: formatPercentageToReadableValue(eModeAssetSettings.collateralFactor * 100),
    },
    {
      label: t('pool.eMode.table.card.rows.liquidationThreshold'),
      value: formatPercentageToReadableValue(eModeAssetSettings.liquidationThresholdPercentage),
    },
    {
      label: t('pool.eMode.table.card.rows.liquidationPenalty'),
      value: formatPercentageToReadableValue(eModeAssetSettings.liquidationPenaltyPercentage),
    },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <TokenIconWithSymbol token={eModeAssetSettings.vToken.underlyingToken} />

        <div
          className={cn(
            'flex items-center gap-x-1',
            eModeAssetSettings.isBorrowable ? 'text-green' : 'text-grey',
          )}
        >
          <Icon
            name={eModeAssetSettings.isBorrowable ? 'mark' : 'close'}
            className="w-5 h-5 text-inherit"
          />

          <span className="text-sm">
            {eModeAssetSettings.isBorrowable
              ? t('pool.eMode.table.card.header.borrowable')
              : t('pool.eMode.table.card.header.notBorrowable')}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {dataListItems.map(item => (
          <LabeledInlineContent key={item.label} label={item.label}>
            {item.value}
          </LabeledInlineContent>
        ))}
      </div>
    </div>
  );
};
