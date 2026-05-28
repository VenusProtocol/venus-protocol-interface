import { type ApiRiskDashboardMarket, useGetRiskDashboardMarkets } from 'clients/api';
import { Spinner, Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Token } from 'types';
import {
  calculatePercentage,
  convertPercentageFromSmartContract,
  convertPriceMantissaToDollars,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { getAddress } from 'viem';

interface RiskRow extends ApiRiskDashboardMarket {
  underlyingToken: Token | null;
  priceCents: number | null;
  utilization: number;
}

const sortByMantissa = (a: string, b: string, direction: 'asc' | 'desc') => {
  const aValue = convertPercentageFromSmartContract(a);
  const bValue = convertPercentageFromSmartContract(b);
  return direction === 'asc' ? aValue - bValue : bValue - aValue;
};

export const RiskParametersTable: React.FC = () => {
  const { t } = useTranslation();
  const vTokens = useGetVTokens();
  const { data, isLoading, isError } = useGetRiskDashboardMarkets();

  const underlyingByVToken = useMemo(() => {
    const map = new Map<string, Token>();
    for (const vToken of vTokens) {
      map.set(getAddress(vToken.address), vToken.underlyingToken);
    }
    return map;
  }, [vTokens]);

  const rows = useMemo<RiskRow[]>(() => {
    if (!data) {
      return [];
    }
    return data.markets.map(market => {
      const underlyingToken = underlyingByVToken.get(market.marketAddress) ?? null;
      const priceCents = underlyingToken
        ? convertPriceMantissaToDollars({
            priceMantissa: market.priceMantissa,
            decimals: underlyingToken.decimals,
          })
            .multipliedBy(100)
            .toNumber()
        : null;
      const utilization = calculatePercentage({
        numerator: Number(market.totalBorrowsUsdCents),
        denominator: Number(market.totalSupplyUsdCents),
      });
      return { ...market, underlyingToken, priceCents, utilization };
    });
  }, [data, underlyingByVToken]);

  const columns = useMemo<TableColumn<RiskRow>[]>(
    () => [
      {
        key: 'asset',
        label: t('statsPage.riskParametersTable.columns.asset'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.asset'),
        align: 'left',
        renderCell: row =>
          row.underlyingToken ? (
            <TokenIconWithSymbol token={row.underlyingToken} />
          ) : (
            row.marketAddress
          ),
      },
      {
        key: 'price',
        label: t('statsPage.riskParametersTable.columns.price'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.price'),
        align: 'right',
        renderCell: row =>
          row.priceCents === null
            ? PLACEHOLDER_KEY
            : formatCentsToReadableValue({ value: row.priceCents }),
      },
      {
        key: 'collateralFactor',
        label: t('statsPage.riskParametersTable.columns.collateralFactor'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.collateralFactor'),
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
        label: t('statsPage.riskParametersTable.columns.liquidationThreshold'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.liquidationThreshold'),
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
        label: t('statsPage.riskParametersTable.columns.liquidationIncentive'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.liquidationIncentive'),
        align: 'right',
        renderCell: row =>
          formatPercentageToReadableValue(
            convertPercentageFromSmartContract(row.liquidationIncentiveMantissa),
          ),
        sortRows: (a, b, direction) =>
          sortByMantissa(a.liquidationIncentiveMantissa, b.liquidationIncentiveMantissa, direction),
      },
      {
        key: 'reserveFactor',
        label: t('statsPage.riskParametersTable.columns.reserveFactor'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.reserveFactor'),
        align: 'right',
        renderCell: row =>
          formatPercentageToReadableValue(
            convertPercentageFromSmartContract(row.reserveFactorMantissa),
          ),
        sortRows: (a, b, direction) =>
          sortByMantissa(a.reserveFactorMantissa, b.reserveFactorMantissa, direction),
      },
      {
        key: 'supplyCap',
        label: t('statsPage.riskParametersTable.columns.supplyCap'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.supplyCap'),
        align: 'right',
        renderCell: row =>
          row.supplyCapUsdCents === null
            ? PLACEHOLDER_KEY
            : formatCentsToReadableValue({ value: row.supplyCapUsdCents }),
      },
      {
        key: 'borrowCap',
        label: t('statsPage.riskParametersTable.columns.borrowCap'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.borrowCap'),
        align: 'right',
        renderCell: row =>
          row.borrowCapUsdCents === null
            ? PLACEHOLDER_KEY
            : formatCentsToReadableValue({ value: row.borrowCapUsdCents }),
      },
      {
        key: 'utilization',
        label: t('statsPage.riskParametersTable.columns.utilization'),
        selectOptionLabel: t('statsPage.riskParametersTable.columns.utilization'),
        align: 'right',
        renderCell: row => formatPercentageToReadableValue(row.utilization),
        sortRows: (a, b, direction) =>
          direction === 'asc' ? a.utilization - b.utilization : b.utilization - a.utilization,
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
    return <p className="text-grey">{t('statsPage.riskParametersTable.unavailable')}</p>;
  }

  if (rows.length === 0) {
    return <p className="text-grey">{t('statsPage.riskParametersTable.noData')}</p>;
  }

  return (
    <Table
      title={t('statsPage.riskParametersTable.title')}
      data={rows}
      columns={columns}
      rowKeyExtractor={row => row.marketAddress}
      minWidth="1200px"
      tableLayout="auto"
    />
  );
};
