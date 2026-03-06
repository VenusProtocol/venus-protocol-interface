import { cn } from '@venusprotocol/ui';

import { Icon, InfoIcon, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { compareBooleans, compareNumbers, formatPercentageToReadableValue } from 'utilities';
import type { ExtendedEModeAssetSettings } from '../../types';

export const ASSET_COLUMN_KEY = 'asset';

export const useColumns = () => {
  const { t } = useTranslation();

  const columns: TableColumn<ExtendedEModeAssetSettings>[] = [
    {
      key: ASSET_COLUMN_KEY,
      label: t('markets.tabs.eMode.table.columns.asset'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.asset'),
      renderCell: ({ vToken, isPaused }) => {
        return (
          <div className="flex items-center gap-x-2">
            <TokenIconWithSymbol displayChain token={vToken.underlyingToken} />

            {isPaused && (
              <InfoIcon
                iconClassName="text-orange"
                iconName="attention"
                tooltip={t('marketTable.assetColumn.pausedAssetTooltip')}
              />
            )}
          </div>
        );
      },
    },
    {
      key: 'collateral',
      label: t('markets.tabs.eMode.table.columns.collateral'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.collateral'),
      renderCell: ({ collateralFactor }) => (
        <Icon
          name={collateralFactor > 0 ? 'mark' : 'close'}
          className={cn('w-5 h-5 ml-auto', collateralFactor > 0 ? 'text-green' : 'text-grey')}
        />
      ),
      sortRows: (rowA, rowB, direction) =>
        compareBooleans(rowA.collateralFactor > 0, rowB.collateralFactor > 0, direction),
      align: 'right',
    },
    {
      key: 'isBorrowable',
      label: t('markets.tabs.eMode.table.columns.isBorrowable'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.isBorrowable'),
      renderCell: ({ isBorrowable }) => (
        <Icon
          name={isBorrowable ? 'mark' : 'close'}
          className={cn('w-5 h-5 ml-auto', isBorrowable ? 'text-green' : 'text-grey')}
        />
      ),
      sortRows: (rowA, rowB, direction) =>
        compareBooleans(rowA.isBorrowable, rowB.isBorrowable, direction),
      align: 'right',
    },
    {
      key: 'maxLtv',
      label: t('markets.tabs.eMode.table.columns.maxLtv'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.maxLtv'),
      renderCell: ({ collateralFactor }) => formatPercentageToReadableValue(collateralFactor * 100),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.collateralFactor, rowB.collateralFactor, direction),
      align: 'right',
    },
    {
      key: 'liquidationThreshold',
      label: t('markets.tabs.eMode.table.columns.threshold'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.liquidationThreshold'),
      renderCell: ({ liquidationThresholdPercentage }) =>
        formatPercentageToReadableValue(liquidationThresholdPercentage),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(
          rowA.liquidationThresholdPercentage,
          rowB.liquidationThresholdPercentage,
          direction,
        ),
      align: 'right',
    },
    {
      key: 'liquidationPenalty',
      label: t('markets.tabs.eMode.table.columns.penalty'),
      selectOptionLabel: t('markets.tabs.eMode.table.columns.liquidationPenalty'),
      renderCell: ({ liquidationPenaltyPercentage }) =>
        formatPercentageToReadableValue(liquidationPenaltyPercentage),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(
          rowB.liquidationPenaltyPercentage,
          rowA.liquidationPenaltyPercentage,
          direction,
        ),
      align: 'right',
    },
  ];

  return columns;
};
