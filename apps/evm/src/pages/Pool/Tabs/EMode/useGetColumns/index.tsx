import { LayeredValues, type TableColumn, TokenIconWithSymbol } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { EModeAssetSettings } from 'types';
import {
  compareNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

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
      key: 'liquidity',
      label: t('pool.eMode.table.columns.liquidity'),
      selectOptionLabel: t('pool.eMode.table.columns.liquidity'),
      renderCell: ({ liquidityCents, liquidityTokens, vToken }) => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: liquidityTokens,
            token: vToken.underlyingToken,
          })}
          bottomValue={formatCentsToReadableValue({
            value: liquidityCents,
          })}
        />
      ),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.liquidityCents, rowB.liquidityCents, direction),
    },
    {
      key: 'maxLtv',
      label: t('pool.eMode.table.columns.maxLtv'),
      selectOptionLabel: t('pool.eMode.table.columns.maxLtv'),
      renderCell: ({ userCollateralFactor }) =>
        formatPercentageToReadableValue(userCollateralFactor * 100),
      sortRows: (rowA, rowB, direction) =>
        compareNumbers(rowA.userCollateralFactor, rowB.userCollateralFactor, direction),
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
  ];

  return columns;
};
