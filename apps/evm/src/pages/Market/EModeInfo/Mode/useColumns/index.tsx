import { cn } from '@venusprotocol/ui';

import { Icon, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import { compareBooleans, compareNumbers, formatPercentageToReadableValue } from 'utilities';
import type { ExtendedEModeAssetSettings } from '../types';

export const useColumns = () => {
  const { t } = useTranslation();

  const columns: TableColumn<ExtendedEModeAssetSettings>[] = [
    {
      key: 'group',
      label: t('market.eModeInfo.table.columns.group'),
      selectOptionLabel: t('market.eModeInfo.table.columns.group'),
      renderCell: ({ eModeGroup }) => (
        <div className="flex items-center gap-x-3 text-p3s">{eModeGroup.name}</div>
      ),
    },
    {
      key: 'collateral',
      label: t('market.eModeInfo.table.columns.collateral'),
      selectOptionLabel: t('market.eModeInfo.table.columns.collateral'),
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
      label: t('market.eModeInfo.table.columns.isBorrowable'),
      selectOptionLabel: t('market.eModeInfo.table.columns.isBorrowable'),
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
      label: t('market.eModeInfo.table.columns.maxLtv'),
      selectOptionLabel: t('market.eModeInfo.table.columns.maxLtv'),
      renderCell: ({ collateralFactor }) => formatPercentageToReadableValue(collateralFactor * 100),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.collateralFactor, rowB.collateralFactor, direction),
      align: 'right',
    },
    {
      key: 'liquidationThreshold',
      label: t('market.eModeInfo.table.columns.liquidationThreshold'),
      selectOptionLabel: t('market.eModeInfo.table.columns.liquidationThreshold'),
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
      label: t('market.eModeInfo.table.columns.liquidationPenalty'),
      selectOptionLabel: t('market.eModeInfo.table.columns.liquidationPenalty'),
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
