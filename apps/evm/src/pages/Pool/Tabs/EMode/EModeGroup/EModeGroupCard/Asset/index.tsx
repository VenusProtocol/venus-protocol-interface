import { cn } from '@venusprotocol/ui';

import { LabeledInlineContent, LayeredValues, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface AssetProps {
  eModeAssetSettings: EModeAssetSettings;
  className?: string;
}

export const Asset: React.FC<AssetProps> = ({ eModeAssetSettings, className }) => {
  const { t } = useTranslation();

  const dataListItems = [
    {
      label: t('pool.eMode.table.card.rows.liquidity'),
      value: (
        <LayeredValues
          className="text-right"
          topValue={formatTokensToReadableValue({
            value: eModeAssetSettings.liquidityTokens,
            token: eModeAssetSettings.vToken.underlyingToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: eModeAssetSettings.liquidityCents,
          })}
        />
      ),
    },
    {
      label: t('pool.eMode.table.card.rows.maxLtv'),
      value: formatPercentageToReadableValue(eModeAssetSettings.userCollateralFactor * 100),
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
      <TokenIconWithSymbol token={eModeAssetSettings.vToken.underlyingToken} />

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
