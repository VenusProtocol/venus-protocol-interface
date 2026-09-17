import { LayeredValues, ProgressBar, type TableColumn, TokenIconWithSymbol } from 'components';
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
  const { t } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'collateral',
      label: t('spokeMarket.supportedCollateral.columns.collateral'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.collateral'),
      renderCell: asset => <TokenIconWithSymbol token={asset.vToken.underlyingToken} />,
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
      renderCell: asset => formatPercentageToReadableValue(asset.collateralFactor * 100),
    },
    {
      key: 'liquidationThreshold',
      label: t('spokeMarket.supportedCollateral.columns.liquidationThreshold'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.liquidationThreshold'),
      align: 'right',
      renderCell: asset => formatPercentageToReadableValue(asset.liquidationThresholdPercentage),
    },
    {
      key: 'penalty',
      label: t('spokeMarket.supportedCollateral.columns.penalty'),
      selectOptionLabel: t('spokeMarket.supportedCollateral.columns.penalty'),
      align: 'right',
      renderCell: asset => formatPercentageToReadableValue(asset.liquidationPenaltyPercentage),
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
          <p className="text-b1r">
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
