import { cn } from '@venusprotocol/ui';

import { Icon, type TableColumn, TokenIconWithSymbol } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import { compareBooleans, compareNumbers, formatPercentageToReadableValue } from 'utilities';

export const useGetColumns = () => {
  const { t } = useTranslation();
  const isSmUp = useBreakpointUp('sm');
  const isLgUp = useBreakpointUp('lg');
  const shouldShowLongLabels = !isSmUp || isLgUp;

  const columns: TableColumn<EModeAssetSettings>[] = [
    {
      key: 'asset',
      label: t('pool.eMode.table.columns.asset'),
      selectOptionLabel: t('pool.eMode.table.columns.asset'),
      renderCell: ({ vToken }) => <TokenIconWithSymbol token={vToken.underlyingToken} />,
    },
    {
      key: 'maxLtv',
      label: t('pool.eMode.table.columns.maxLtv'),
      selectOptionLabel: t('pool.eMode.table.columns.maxLtv'),
      renderCell: ({ collateralFactor }) => formatPercentageToReadableValue(collateralFactor * 100),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.collateralFactor, rowB.collateralFactor, direction),
    },
    {
      key: 'liquidationThreshold',
      label: shouldShowLongLabels
        ? t('pool.eMode.table.columns.liquidationThreshold')
        : t('pool.eMode.table.columns.threshold'),
      selectOptionLabel: t('pool.eMode.table.columns.liquidationThreshold'),
      renderCell: ({ liquidationThresholdPercentage }) =>
        formatPercentageToReadableValue(liquidationThresholdPercentage),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(
          rowA.liquidationThresholdPercentage,
          rowB.liquidationThresholdPercentage,
          direction,
        ),
    },
    {
      key: 'liquidationPenalty',
      label: shouldShowLongLabels
        ? t('pool.eMode.table.columns.liquidationPenalty')
        : t('pool.eMode.table.columns.penalty'),
      selectOptionLabel: t('pool.eMode.table.columns.liquidationPenalty'),
      renderCell: ({ liquidationPenaltyPercentage }) =>
        formatPercentageToReadableValue(liquidationPenaltyPercentage),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(
          rowA.liquidationPenaltyPercentage,
          rowB.liquidationPenaltyPercentage,
          direction,
        ),
    },
    {
      key: 'isBorrowable',
      label: t('pool.eMode.table.columns.isBorrowable'),
      selectOptionLabel: t('pool.eMode.table.columns.isBorrowable'),
      renderCell: ({ isBorrowable }) => (
        <Icon
          name={isBorrowable ? 'mark' : 'close'}
          className={cn('w-5 h-5', isBorrowable ? 'text-green' : 'text-grey')}
        />
      ),
      sortRows: (rowA, rowB, direction) =>
        compareBooleans(rowA.isBorrowable, rowB.isBorrowable, direction),
    },
  ];

  return columns;
};
