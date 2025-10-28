import { cn } from '@venusprotocol/ui';

import { Icon, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import { compareBooleans, compareNumbers, formatPercentageToReadableValue } from 'utilities';

export const ASSET_COLUMN_KEY = 'asset';

export const useColumns = () => {
  const { t } = useTranslation();

  const columns: TableColumn<EModeAssetSettings>[] = [
    {
      key: ASSET_COLUMN_KEY,
      label: t('pool.eMode.table.columns.asset'),
      selectOptionLabel: t('pool.eMode.table.columns.asset'),
      renderCell: ({ vToken }) => <TokenIconWithSymbol token={vToken.underlyingToken} />,
    },
    {
      key: 'collateral',
      label: t('pool.eMode.table.columns.collateral'),
      selectOptionLabel: t('pool.eMode.table.columns.collateral'),
      renderCell: ({ collateralFactor }) => (
        <Icon
          name={collateralFactor > 0 ? 'mark' : 'close'}
          className={cn('w-5 h-5 ml-auto', collateralFactor > 0 ? 'text-green' : 'text-grey')}
        />
      ),
      sortRows: (rowA, rowB, direction) =>
        compareBooleans(rowA.isBorrowable, rowB.isBorrowable, direction),
      align: 'right',
    },
    {
      key: 'isBorrowable',
      label: t('pool.eMode.table.columns.isBorrowable'),
      selectOptionLabel: t('pool.eMode.table.columns.isBorrowable'),
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
      label: t('pool.eMode.table.columns.maxLtv'),
      selectOptionLabel: t('pool.eMode.table.columns.maxLtv'),
      renderCell: ({ collateralFactor }) => formatPercentageToReadableValue(collateralFactor * 100),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.collateralFactor, rowB.collateralFactor, direction),
      align: 'right',
    },
    {
      key: 'liquidationThreshold',
      label: t('pool.eMode.table.columns.threshold'),
      selectOptionLabel: t('pool.eMode.table.columns.liquidationThreshold'),
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
      label: t('pool.eMode.table.columns.penalty'),
      selectOptionLabel: t('pool.eMode.table.columns.liquidationPenalty'),
      renderCell: ({ liquidationPenaltyPercentage }) =>
        formatPercentageToReadableValue(liquidationPenaltyPercentage),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(
          rowA.liquidationPenaltyPercentage,
          rowB.liquidationPenaltyPercentage,
          direction,
        ),
      align: 'right',
    },
  ];

  return columns;
};
