import { cn } from '@venusprotocol/ui';

import {
  InfoIcon,
  LayeredValues,
  ProgressBar,
  type TableColumn,
  TokenIconWithSymbol,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export const useColumns = () => {
  const { t, Trans } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'collateral',
      label: t('spokeMarket.supportedCollateral.columns.collateral'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.collateral'),
      renderCell: asset => (
        <div className="flex items-center gap-x-2">
          <TokenIconWithSymbol token={asset.vToken.underlyingToken} />

          {asset.isInactive && (
            <InfoIcon
              iconClassName="text-orange"
              iconName="attention"
              tooltip={t('marketTable.assetColumn.pausedAssetTooltip')}
            />
          )}
        </div>
      ),
    },
    {
      key: 'supplied',
      label: t('spokeMarket.supportedCollateral.columns.supplied'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.supplied'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.userSupplyBalanceCents, rowB.userSupplyBalanceCents, direction),
      renderCell: asset =>
        asset.userSupplyBalanceTokens.isGreaterThan(0) ? (
          <LayeredValues
            className={cn(asset.isInactive && 'text-grey')}
            topValue={formatTokensToReadableValue({
              value: asset.userSupplyBalanceTokens,
              token: asset.vToken.underlyingToken,
              addSymbol: false,
            })}
            bottomValue={formatCentsToReadableValue({ value: asset.userSupplyBalanceCents })}
          />
        ) : (
          PLACEHOLDER_KEY
        ),
    },
    {
      key: 'maxLtv',
      label: t('spokeMarket.supportedCollateral.columns.maxLtv'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.maxLtv'),
      align: 'right',
      renderCell: asset => (
        <span className={cn(asset.isInactive && 'text-grey')}>
          {formatPercentageToReadableValue(asset.collateralFactor * 100)}
        </span>
      ),
    },
    {
      key: 'liquidationThreshold',
      label: (
        <Trans
          i18nKey="spokeMarket.supportedCollateral.columns.liquidationThreshold"
          components={{
            InfoIcon: (
              <InfoIcon
                className="ml-1"
                tooltip={t('spokeMarket.supportedCollateral.columnTooltips.liquidationThreshold')}
              />
            ),
          }}
        />
      ),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columnTooltips.liquidationThreshold'),
      align: 'right',
      renderCell: asset => (
        <span className={cn(asset.isInactive && 'text-grey')}>
          {formatPercentageToReadableValue(asset.liquidationThresholdPercentage)}
        </span>
      ),
    },
    {
      key: 'penalty',
      label: t('spokeMarket.supportedCollateral.columns.penalty'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.penalty'),
      align: 'right',
      renderCell: asset => (
        <span className={cn(asset.isInactive && 'text-grey')}>
          {formatPercentageToReadableValue(asset.liquidationPenaltyPercentage)}
        </span>
      ),
    },
    {
      key: 'capacityFilled',
      label: t('spokeMarket.supportedCollateral.columns.capacityFilled'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.capacityFilled'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(
          rowA.supplyBalanceTokens.div(rowA.supplyCapTokens),
          rowB.supplyBalanceTokens.div(rowB.supplyCapTokens),
          direction,
        ),
      renderCell: asset => (
        <div className="space-y-1">
          <p className={cn('text-b1r', asset.isInactive && 'text-grey')}>
            {t('spokeMarket.supportedCollateral.capacity', {
              supplied: formatTokensToReadableValue({
                value: asset.supplyBalanceTokens,
                token: asset.vToken.underlyingToken,
                addSymbol: false,
              }),
              cap: formatTokensToReadableValue({
                value: asset.supplyCapTokens,
                token: asset.vToken.underlyingToken,
                addSymbol: false,
              }),
            })}
          </p>

          <ProgressBar
            min={0}
            max={asset.supplyCapTokens.toNumber()}
            progressBars={[{ value: asset.supplyBalanceTokens.toNumber() }]}
          />
        </div>
      ),
    },
  ];

  return columns;
};
