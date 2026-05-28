import { type ApiRiskDashboardEModeSetting, useGetRiskDashboardEModePools } from 'clients/api';
import { Spinner, Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Token } from 'types';
import { convertPercentageFromSmartContract, formatPercentageToReadableValue } from 'utilities';
import { getAddress } from 'viem';

interface EModeRow extends ApiRiskDashboardEModeSetting {
  underlyingToken: Token | null;
}

const sortByMantissa = (a: string, b: string, direction: 'asc' | 'desc') => {
  const aValue = convertPercentageFromSmartContract(a);
  const bValue = convertPercentageFromSmartContract(b);
  return direction === 'asc' ? aValue - bValue : bValue - aValue;
};

export const EModeTable: React.FC = () => {
  const { t } = useTranslation();
  const vTokens = useGetVTokens();
  const { data, isLoading, isError } = useGetRiskDashboardEModePools();

  const underlyingByVToken = useMemo(() => {
    const map = new Map<string, Token>();
    for (const vToken of vTokens) {
      map.set(getAddress(vToken.address), vToken.underlyingToken);
    }
    return map;
  }, [vTokens]);

  const rows = useMemo<EModeRow[]>(() => {
    if (!data) {
      return [];
    }
    return data.settings.map(setting => ({
      ...setting,
      underlyingToken: underlyingByVToken.get(setting.marketAddress) ?? null,
    }));
  }, [data, underlyingByVToken]);

  const columns = useMemo<TableColumn<EModeRow>[]>(
    () => [
      {
        key: 'group',
        label: t('statsPage.eModeTable.columns.group'),
        selectOptionLabel: t('statsPage.eModeTable.columns.group'),
        align: 'left',
        renderCell: row => row.label,
        sortRows: (a, b, direction) =>
          direction === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label),
      },
      {
        key: 'asset',
        label: t('statsPage.eModeTable.columns.asset'),
        selectOptionLabel: t('statsPage.eModeTable.columns.asset'),
        align: 'left',
        renderCell: row =>
          row.underlyingToken ? (
            <TokenIconWithSymbol token={row.underlyingToken} />
          ) : (
            row.marketAddress
          ),
      },
      {
        key: 'collateralFactor',
        label: t('statsPage.eModeTable.columns.collateralFactor'),
        selectOptionLabel: t('statsPage.eModeTable.columns.collateralFactor'),
        align: 'right',
        renderCell: row =>
          formatPercentageToReadableValue(
            convertPercentageFromSmartContract(row.collateralFactorMantissa),
          ),
        sortRows: (a, b, direction) =>
          sortByMantissa(a.collateralFactorMantissa, b.collateralFactorMantissa, direction),
      },
      {
        key: 'liquidationThreshold',
        label: t('statsPage.eModeTable.columns.liquidationThreshold'),
        selectOptionLabel: t('statsPage.eModeTable.columns.liquidationThreshold'),
        align: 'right',
        renderCell: row =>
          formatPercentageToReadableValue(
            convertPercentageFromSmartContract(row.liquidationThresholdMantissa),
          ),
        sortRows: (a, b, direction) =>
          sortByMantissa(a.liquidationThresholdMantissa, b.liquidationThresholdMantissa, direction),
      },
      {
        key: 'liquidationIncentive',
        label: t('statsPage.eModeTable.columns.liquidationIncentive'),
        selectOptionLabel: t('statsPage.eModeTable.columns.liquidationIncentive'),
        align: 'right',
        renderCell: row =>
          formatPercentageToReadableValue(
            convertPercentageFromSmartContract(row.liquidationIncentiveMantissa),
          ),
        sortRows: (a, b, direction) =>
          sortByMantissa(a.liquidationIncentiveMantissa, b.liquidationIncentiveMantissa, direction),
      },
      {
        key: 'collateral',
        label: t('statsPage.eModeTable.columns.collateral'),
        selectOptionLabel: t('statsPage.eModeTable.columns.collateral'),
        align: 'right',
        renderCell: row =>
          row.canBeCollateral ? t('statsPage.eModeTable.yes') : t('statsPage.eModeTable.no'),
      },
      {
        key: 'borrowable',
        label: t('statsPage.eModeTable.columns.borrowable'),
        selectOptionLabel: t('statsPage.eModeTable.columns.borrowable'),
        align: 'right',
        renderCell: row =>
          row.isBorrowable ? t('statsPage.eModeTable.yes') : t('statsPage.eModeTable.no'),
      },
    ],
    [t],
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-32 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-grey">{t('statsPage.eModeTable.unavailable')}</p>;
  }

  if (rows.length === 0) {
    return <p className="text-grey">{t('statsPage.eModeTable.noData')}</p>;
  }

  return (
    <Table
      title={t('statsPage.eModeTable.title')}
      data={rows}
      columns={columns}
      rowKeyExtractor={row => `${row.poolId}-${row.marketAddress}`}
      minWidth="1000px"
      tableLayout="auto"
    />
  );
};
