import { getBlockTimeByChainId } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import { type ApiRiskDashboardMarket, useGetRiskDashboardMarkets } from 'clients/api';
import { Spinner, Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import type { Token } from 'types';
import {
  calculateDailyTokenRate,
  calculateYearlyPercentageRate,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import { getAddress } from 'viem';

interface MarketRow extends ApiRiskDashboardMarket {
  underlyingToken: Token | null;
  utilization: number | null;
  supplyApyPercentage: number | null;
  borrowApyPercentage: number | null;
  supplyCapFilledFraction: number | null;
  borrowCapFilledFraction: number | null;
  topSupplierShareFraction: number | null;
  topBorrowerShareFraction: number | null;
}

const toNumber = (cents: string | null) => (cents === null ? null : Number(cents));

const ratio = (numerator: string | null, denominator: string) => {
  if (numerator === null) {
    return null;
  }
  const denominatorBn = new BigNumber(denominator);
  if (denominatorBn.isZero()) {
    return null;
  }
  return new BigNumber(numerator).dividedBy(denominatorBn).toNumber();
};

const calculateApyPercentage = (ratePerBlockMantissa: string, blocksPerDay?: number) => {
  const rateMantissa = new BigNumber(ratePerBlockMantissa);
  if (rateMantissa.isZero()) {
    return 0;
  }
  const dailyPercentageRate = calculateDailyTokenRate({
    rateMantissa,
    blocksPerDay,
  });
  return calculateYearlyPercentageRate({ dailyPercentageRate }).toNumber();
};

const renderUsdCell = (cents: string | null) => {
  if (cents === null) {
    return PLACEHOLDER_KEY;
  }
  return formatCentsToReadableValue({ value: cents });
};

const renderPercentageCell = (fraction: number | null) => {
  if (fraction === null) {
    return PLACEHOLDER_KEY;
  }
  return formatPercentageToReadableValue(fraction * 100);
};

const compareNullable = (a: number | null, b: number | null, direction: 'asc' | 'desc') => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return direction === 'asc' ? a - b : b - a;
};

export const MarketsTable: React.FC = () => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const vTokens = useGetVTokens({ chainId });
  const { data, isLoading, isError } = useGetRiskDashboardMarkets();

  const blocksPerDay = getBlockTimeByChainId({ chainId })?.blocksPerDay;

  const underlyingByVToken = useMemo(() => {
    const map = new Map<string, Token>();
    for (const vToken of vTokens) {
      map.set(getAddress(vToken.address), vToken.underlyingToken);
    }
    return map;
  }, [vTokens]);

  const rows = useMemo<MarketRow[]>(() => {
    if (!data) {
      return [];
    }
    return data.markets.map(market => ({
      ...market,
      underlyingToken: underlyingByVToken.get(market.marketAddress) ?? null,
      utilization: ratio(market.totalBorrowsUsdCents, market.totalSupplyUsdCents),
      supplyApyPercentage: calculateApyPercentage(market.supplyRatePerBlockMantissa, blocksPerDay),
      borrowApyPercentage: calculateApyPercentage(market.borrowRatePerBlockMantissa, blocksPerDay),
      supplyCapFilledFraction: ratio(market.totalSupplyUsdCents, market.supplyCapUsdCents ?? '0'),
      borrowCapFilledFraction: ratio(market.totalBorrowsUsdCents, market.borrowCapUsdCents ?? '0'),
      topSupplierShareFraction: ratio(market.topSupplierUsdCents, market.totalSupplyUsdCents),
      topBorrowerShareFraction: ratio(market.topBorrowerUsdCents, market.totalBorrowsUsdCents),
    }));
  }, [data, underlyingByVToken, blocksPerDay]);

  const columns = useMemo<TableColumn<MarketRow>[]>(
    () => [
      {
        key: 'asset',
        label: t('statsPage.marketsTable.columns.asset'),
        selectOptionLabel: t('statsPage.marketsTable.columns.asset'),
        align: 'left',
        renderCell: row =>
          row.underlyingToken ? (
            <TokenIconWithSymbol token={row.underlyingToken} />
          ) : (
            row.marketAddress
          ),
        sortRows: (a, b, direction) => {
          const symbolA = a.underlyingToken?.symbol ?? a.marketAddress;
          const symbolB = b.underlyingToken?.symbol ?? b.marketAddress;
          return direction === 'asc'
            ? symbolA.localeCompare(symbolB)
            : symbolB.localeCompare(symbolA);
        },
      },
      {
        key: 'totalSupplyUsdCents',
        label: t('statsPage.marketsTable.columns.totalSupply'),
        selectOptionLabel: t('statsPage.marketsTable.columns.totalSupply'),
        align: 'right',
        renderCell: row => renderUsdCell(row.totalSupplyUsdCents),
        sortRows: (a, b, direction) =>
          compareNullable(
            toNumber(a.totalSupplyUsdCents),
            toNumber(b.totalSupplyUsdCents),
            direction,
          ),
      },
      {
        key: 'totalBorrowsUsdCents',
        label: t('statsPage.marketsTable.columns.totalBorrows'),
        selectOptionLabel: t('statsPage.marketsTable.columns.totalBorrows'),
        align: 'right',
        renderCell: row => renderUsdCell(row.totalBorrowsUsdCents),
        sortRows: (a, b, direction) =>
          compareNullable(
            toNumber(a.totalBorrowsUsdCents),
            toNumber(b.totalBorrowsUsdCents),
            direction,
          ),
      },
      {
        key: 'utilization',
        label: t('statsPage.marketsTable.columns.utilization'),
        selectOptionLabel: t('statsPage.marketsTable.columns.utilization'),
        align: 'right',
        renderCell: row => renderPercentageCell(row.utilization),
        sortRows: (a, b, direction) => compareNullable(a.utilization, b.utilization, direction),
      },
      {
        key: 'supplyApy',
        label: t('statsPage.marketsTable.columns.supplyApy'),
        selectOptionLabel: t('statsPage.marketsTable.columns.supplyApy'),
        align: 'right',
        renderCell: row =>
          row.supplyApyPercentage === null
            ? PLACEHOLDER_KEY
            : formatPercentageToReadableValue(row.supplyApyPercentage),
        sortRows: (a, b, direction) =>
          compareNullable(a.supplyApyPercentage, b.supplyApyPercentage, direction),
      },
      {
        key: 'borrowApy',
        label: t('statsPage.marketsTable.columns.borrowApy'),
        selectOptionLabel: t('statsPage.marketsTable.columns.borrowApy'),
        align: 'right',
        renderCell: row =>
          row.borrowApyPercentage === null
            ? PLACEHOLDER_KEY
            : formatPercentageToReadableValue(row.borrowApyPercentage),
        sortRows: (a, b, direction) =>
          compareNullable(a.borrowApyPercentage, b.borrowApyPercentage, direction),
      },
      {
        key: 'totalDebtAgainst',
        label: t('statsPage.marketsTable.columns.totalDebtAgainst'),
        selectOptionLabel: t('statsPage.marketsTable.columns.totalDebtAgainst'),
        align: 'right',
        renderCell: row => renderUsdCell(row.totalDebtAgainstUsdCents),
      },
      {
        key: 'stablecoinDebt',
        label: t('statsPage.marketsTable.columns.stablecoinDebt'),
        selectOptionLabel: t('statsPage.marketsTable.columns.stablecoinDebt'),
        align: 'right',
        renderCell: row => renderUsdCell(row.stablecoinDebtUsdCents),
      },
      {
        key: 'bnbDebt',
        label: t('statsPage.marketsTable.columns.bnbDebt'),
        selectOptionLabel: t('statsPage.marketsTable.columns.bnbDebt'),
        align: 'right',
        renderCell: row => renderUsdCell(row.bnbDebtUsdCents),
      },
      {
        key: 'otherDebt',
        label: t('statsPage.marketsTable.columns.otherDebt'),
        selectOptionLabel: t('statsPage.marketsTable.columns.otherDebt'),
        align: 'right',
        renderCell: row => renderUsdCell(row.otherDebtUsdCents),
      },
      {
        key: 'liquidityUsdCents',
        label: t('statsPage.marketsTable.columns.liquidity'),
        selectOptionLabel: t('statsPage.marketsTable.columns.liquidity'),
        align: 'right',
        renderCell: row => renderUsdCell(row.liquidityUsdCents),
        sortRows: (a, b, direction) =>
          compareNullable(toNumber(a.liquidityUsdCents), toNumber(b.liquidityUsdCents), direction),
      },
      {
        key: 'supplyCap',
        label: t('statsPage.marketsTable.columns.supplyCap'),
        selectOptionLabel: t('statsPage.marketsTable.columns.supplyCap'),
        align: 'right',
        renderCell: row => renderUsdCell(row.supplyCapUsdCents),
        sortRows: (a, b, direction) =>
          compareNullable(toNumber(a.supplyCapUsdCents), toNumber(b.supplyCapUsdCents), direction),
      },
      {
        key: 'borrowCap',
        label: t('statsPage.marketsTable.columns.borrowCap'),
        selectOptionLabel: t('statsPage.marketsTable.columns.borrowCap'),
        align: 'right',
        renderCell: row => renderUsdCell(row.borrowCapUsdCents),
        sortRows: (a, b, direction) =>
          compareNullable(toNumber(a.borrowCapUsdCents), toNumber(b.borrowCapUsdCents), direction),
      },
      {
        key: 'supplyCapFilled',
        label: t('statsPage.marketsTable.columns.supplyCapFilled'),
        selectOptionLabel: t('statsPage.marketsTable.columns.supplyCapFilled'),
        align: 'right',
        renderCell: row => renderPercentageCell(row.supplyCapFilledFraction),
        sortRows: (a, b, direction) =>
          compareNullable(a.supplyCapFilledFraction, b.supplyCapFilledFraction, direction),
      },
      {
        key: 'borrowCapFilled',
        label: t('statsPage.marketsTable.columns.borrowCapFilled'),
        selectOptionLabel: t('statsPage.marketsTable.columns.borrowCapFilled'),
        align: 'right',
        renderCell: row => renderPercentageCell(row.borrowCapFilledFraction),
        sortRows: (a, b, direction) =>
          compareNullable(a.borrowCapFilledFraction, b.borrowCapFilledFraction, direction),
      },
      {
        key: 'topSupplierShare',
        label: t('statsPage.marketsTable.columns.topSupplierShare'),
        selectOptionLabel: t('statsPage.marketsTable.columns.topSupplierShare'),
        align: 'right',
        renderCell: row => renderPercentageCell(row.topSupplierShareFraction),
        sortRows: (a, b, direction) =>
          compareNullable(a.topSupplierShareFraction, b.topSupplierShareFraction, direction),
      },
      {
        key: 'topBorrowerShare',
        label: t('statsPage.marketsTable.columns.topBorrowerShare'),
        selectOptionLabel: t('statsPage.marketsTable.columns.topBorrowerShare'),
        align: 'right',
        renderCell: row => renderPercentageCell(row.topBorrowerShareFraction),
        sortRows: (a, b, direction) =>
          compareNullable(a.topBorrowerShareFraction, b.topBorrowerShareFraction, direction),
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
    return <p className="text-grey">{t('statsPage.marketsTable.unavailable')}</p>;
  }

  if (rows.length === 0) {
    return <p className="text-grey">{t('statsPage.marketsTable.noData')}</p>;
  }

  const totalSupplyColumn = columns.find(col => col.key === 'totalSupplyUsdCents');

  return (
    <Table
      title={t('statsPage.marketsTable.title')}
      data={rows}
      columns={columns}
      rowKeyExtractor={row => row.marketAddress}
      minWidth="1600px"
      tableLayout="auto"
      initialOrder={
        totalSupplyColumn ? { orderBy: totalSupplyColumn, orderDirection: 'desc' } : undefined
      }
    />
  );
};
