import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardTopWallet,
  type RiskDashboardTopWalletsKind,
  useGetRiskDashboardTopWallets,
} from 'clients/api';
import { Spinner } from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  BarChart as RCBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCentsToReadableValue, truncateAddress } from 'utilities';
import { getAddress } from 'viem';
import { roundUpToScale } from '../../roundUpToScale';
import { useMarketColors } from '../../useMarketColors';

interface MarketMeta {
  symbol: string;
  iconSrc?: string;
}

const SUPPLY_KEY_PREFIX = 'supply:';
const BORROW_KEY_PREFIX = 'borrow:';

interface ChartDatum {
  address: string;
  shortAddress: string;
  supplyTotal: number;
  borrowTotal: number;
  [seriesKey: string]: number | string;
}

const toDollars = (cents: string) => Number(cents) / 100;

const formatDollarsToCents = (dollars: number) =>
  formatCentsToReadableValue({ value: Math.round(Math.abs(dollars) * 100) });

const formatYAxisTick = (dollars: number) => {
  const formatted = formatDollarsToCents(dollars);
  if (dollars < 0) {
    return `-${formatted}`;
  }
  return formatted;
};

const getYAxisDomain = (chartData: ChartDatum[]) => {
  let maxSupplyTotal = 0;
  let maxBorrowTotal = 0;

  for (const datum of chartData) {
    if (datum.supplyTotal > maxSupplyTotal) {
      maxSupplyTotal = datum.supplyTotal;
    }
    if (datum.borrowTotal > maxBorrowTotal) {
      maxBorrowTotal = datum.borrowTotal;
    }
  }

  return [-roundUpToScale(maxBorrowTotal), roundUpToScale(maxSupplyTotal)];
};

const buildChartData = (wallets: ApiRiskDashboardTopWallet[]) =>
  wallets.map(wallet => {
    const datum: ChartDatum = {
      address: wallet.address,
      shortAddress: truncateAddress(wallet.address),
      supplyTotal: 0,
      borrowTotal: 0,
    };

    for (const position of wallet.positions) {
      const supply = toDollars(position.supplyUsdCents);
      const borrow = toDollars(position.borrowUsdCents);

      if (supply > 0) {
        datum[`${SUPPLY_KEY_PREFIX}${position.marketAddress}`] = supply;
        datum.supplyTotal += supply;
      }
      if (borrow > 0) {
        datum[`${BORROW_KEY_PREFIX}${position.marketAddress}`] = -borrow;
        datum.borrowTotal += borrow;
      }
    }
    return datum;
  });

const parseSeriesKey = (key: string) => {
  if (key.startsWith(SUPPLY_KEY_PREFIX)) {
    return { side: 'supply' as const, marketAddress: key.slice(SUPPLY_KEY_PREFIX.length) };
  }
  if (key.startsWith(BORROW_KEY_PREFIX)) {
    return { side: 'borrow' as const, marketAddress: key.slice(BORROW_KEY_PREFIX.length) };
  }
  return null;
};

const collectMarketAddresses = (chartData: ChartDatum[]) => {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const datum of chartData) {
    for (const key of Object.keys(datum)) {
      const parsed = parseSeriesKey(key);
      if (!parsed) {
        continue;
      }
      if (!seen.has(parsed.marketAddress)) {
        seen.add(parsed.marketAddress);
        ordered.push(parsed.marketAddress);
      }
    }
  }
  return ordered;
};

interface TooltipPayloadItem {
  dataKey: unknown;
  value: number;
  color: string;
  payload: ChartDatum;
}

interface BreakdownItem {
  marketAddress: string;
  side: 'supply' | 'borrow';
  absValue: number;
  color: string;
}

const TopWalletsTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  marketMetaByAddress: Record<string, MarketMeta>;
}> = ({ active, payload, marketMetaByAddress }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  const breakdown: BreakdownItem[] = [];
  for (const item of payload) {
    if (typeof item.dataKey !== 'string') {
      continue;
    }
    const parsed = parseSeriesKey(item.dataKey);
    if (!parsed || item.value === 0) {
      continue;
    }
    breakdown.push({
      marketAddress: parsed.marketAddress,
      side: parsed.side,
      absValue: Math.abs(item.value),
      color: item.color,
    });
  }
  breakdown.sort((a, b) => b.absValue - a.absValue);

  const sideLabel = (side: 'supply' | 'borrow') =>
    side === 'supply'
      ? t('statsPage.topWallets.tooltip.supply')
      : t('statsPage.topWallets.tooltip.borrow');

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[240px]">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-b2s text-white font-mono">{datum.shortAddress}</span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-1">
        <span className="text-b2r text-grey">{t('statsPage.topWallets.tooltip.supply')}</span>
        <span className="text-b2s text-white">{formatDollarsToCents(datum.supplyTotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-lightGrey">
        <span className="text-b2r text-grey">{t('statsPage.topWallets.tooltip.borrow')}</span>
        <span className="text-b2s text-white">{formatDollarsToCents(datum.borrowTotal)}</span>
      </div>

      {breakdown.map(item => {
        const meta = marketMetaByAddress[item.marketAddress];
        const label = meta?.symbol ?? truncateAddress(item.marketAddress);
        return (
          <div
            key={`${item.side}:${item.marketAddress}`}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-b2r text-grey truncate">
                {label} <span className="text-grey/70">({sideLabel(item.side)})</span>
              </span>
            </div>
            <span className="text-b2s text-white whitespace-nowrap">
              {formatDollarsToCents(item.absValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export interface TopWalletsTableProps {
  kind: RiskDashboardTopWalletsKind;
  limit?: number;
}

export const TopWalletsTable: React.FC<TopWalletsTableProps> = ({ kind, limit = 10 }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardTopWallets({ kind, limit });
  const vTokens = useGetVTokens();

  const marketMetaByAddress = useMemo(() => {
    const map: Record<string, MarketMeta> = {};
    for (const vToken of vTokens) {
      map[getAddress(vToken.address)] = {
        symbol: vToken.underlyingToken.symbol,
        iconSrc: vToken.underlyingToken.iconSrc,
      };
    }
    return map;
  }, [vTokens]);

  const chartData = useMemo(() => (data ? buildChartData(data.wallets) : []), [data]);

  const yAxisDomain = useMemo(() => getYAxisDomain(chartData), [chartData]);

  const marketAddresses = useMemo(() => collectMarketAddresses(chartData), [chartData]);

  const marketsBySizeDesc = useMemo(() => {
    const totalAbsByMarket = new Map<string, number>();
    for (const datum of chartData) {
      for (const market of marketAddresses) {
        const supplyVal = datum[`${SUPPLY_KEY_PREFIX}${market}`];
        const borrowVal = datum[`${BORROW_KEY_PREFIX}${market}`];
        const supply = typeof supplyVal === 'number' ? supplyVal : 0;
        const borrow = typeof borrowVal === 'number' ? Math.abs(borrowVal) : 0;
        totalAbsByMarket.set(market, (totalAbsByMarket.get(market) ?? 0) + supply + borrow);
      }
    }
    return [...marketAddresses].sort(
      (marketA, marketB) =>
        (totalAbsByMarket.get(marketB) ?? 0) - (totalAbsByMarket.get(marketA) ?? 0),
    );
  }, [chartData, marketAddresses]);

  const { colorByMarket } = useMarketColors();

  const unavailableMessage =
    kind === 'suppliers'
      ? t('statsPage.topWallets.unavailableSuppliers')
      : t('statsPage.topWallets.unavailableBorrowers');

  return (
    <div className="w-full h-100 flex items-center justify-center">
      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <p className="text-grey">{unavailableMessage}</p>
      ) : data.wallets.length === 0 ? (
        <p className="text-grey">{t('statsPage.topWallets.noData')}</p>
      ) : (
        <div className="w-full h-full flex gap-4">
          <div className="flex-1 min-w-0">
            <ResponsiveContainer>
              <RCBarChart
                data={chartData}
                margin={{ top: 16, left: 0, right: 8, bottom: 0 }}
                stackOffset="sign"
              >
                <CartesianGrid
                  stroke={theme.colors.lightGrey}
                  strokeOpacity={0.3}
                  vertical={false}
                />

                <XAxis
                  dataKey="shortAddress"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  stroke={theme.colors.grey}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={56}
                  tick={{ fill: theme.colors.white, fontSize: 11, fontFamily: 'monospace' }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  width={72}
                  stroke={theme.colors.grey}
                  domain={yAxisDomain}
                  tick={({ payload, x, y }) => (
                    <text
                      x={x}
                      y={y}
                      dy={4}
                      textAnchor="end"
                      fill={theme.colors.grey}
                      fontSize={12}
                    >
                      {formatYAxisTick(payload.value)}
                    </text>
                  )}
                />

                <Tooltip
                  cursor={{ fill: theme.colors.lightGrey, fillOpacity: 0.1 }}
                  content={<TopWalletsTooltip marketMetaByAddress={marketMetaByAddress} />}
                />

                <ReferenceLine y={0} stroke={theme.colors.lightGrey} />

                {marketAddresses.map(market => {
                  const dataKey = `${SUPPLY_KEY_PREFIX}${market}`;
                  return (
                    <Bar
                      key={dataKey}
                      dataKey={dataKey}
                      stackId="positions"
                      fill={colorByMarket[market] ?? theme.colors.grey}
                    />
                  );
                })}

                {marketAddresses.map(market => {
                  const dataKey = `${BORROW_KEY_PREFIX}${market}`;
                  return (
                    <Bar
                      key={dataKey}
                      dataKey={dataKey}
                      stackId="positions"
                      fill={colorByMarket[market] ?? theme.colors.grey}
                      fillOpacity={0.6}
                    />
                  );
                })}
              </RCBarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto py-2 pr-1 shrink-0">
            {marketsBySizeDesc.map(market => {
              const meta = marketMetaByAddress[market];
              const label = meta?.symbol ?? truncateAddress(market);
              const bgColor = colorByMarket[market] ?? theme.colors.grey;
              return (
                <div key={market} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: `${bgColor}` }}
                  />
                  <span className="text-b2r text-grey whitespace-nowrap">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
