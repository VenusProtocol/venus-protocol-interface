import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardMarketSnapshotSlot,
  useGetRiskDashboardMarketSnapshots,
} from 'clients/api';
import { Card, Spinner } from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  AreaChart as RCAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCentsToReadableValue } from 'utilities';
import { getAddress } from 'viem';
import { roundUpToScale } from '../roundUpToScale';
import { useMarketColors } from '../useMarketColors';

const OTHERS_KEY = 'others';
const OTHERS_THRESHOLD_DOLLARS = 50_000_000;

type Metric = 'supply' | 'borrows';

interface MarketMeta {
  symbol: string;
}

interface ChartDatum {
  timestamp: number;
  blockNumber: string;
  total: number;
  [marketAddressOrOthers: string]: number | string;
}

const toDollars = (cents: string) => Number(cents) / 100;

const formatDollarsToCents = (dollars: number) =>
  formatCentsToReadableValue({ value: Math.round(Math.abs(dollars) * 100) });

const formatDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatTooltipDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const readPointValue = (
  point: { supplyUsdCents: string; borrowsUsdCents: string },
  metric: Metric,
) => (metric === 'supply' ? toDollars(point.supplyUsdCents) : toDollars(point.borrowsUsdCents));

const readSlotTotal = (slot: ApiRiskDashboardMarketSnapshotSlot, metric: Metric) =>
  metric === 'supply' ? toDollars(slot.totalSupplyUsdCents) : toDollars(slot.totalBorrowsUsdCents);

const computePeakByMarket = (series: ApiRiskDashboardMarketSnapshotSlot[], metric: Metric) => {
  const peaks = new Map<string, number>();
  for (const slot of series) {
    for (const point of slot.byMarket) {
      const market = getAddress(point.marketAddress);
      const value = readPointValue(point, metric);
      const currentPeak = peaks.get(market) ?? 0;
      if (value > currentPeak) {
        peaks.set(market, value);
      }
    }
  }
  return peaks;
};

const buildChartData = (
  series: ApiRiskDashboardMarketSnapshotSlot[],
  metric: Metric,
  isMajorMarket: (market: string) => boolean,
) =>
  series.map(slot => {
    const datum: ChartDatum = {
      timestamp: new Date(slot.blockTimestamp).getTime(),
      blockNumber: slot.blockNumber,
      total: readSlotTotal(slot, metric),
    };

    let othersValue = 0;
    for (const point of slot.byMarket) {
      const market = getAddress(point.marketAddress);
      const value = readPointValue(point, metric);
      if (isMajorMarket(market)) {
        datum[market] = value;
      } else {
        othersValue += value;
      }
    }
    if (othersValue > 0) {
      datum[OTHERS_KEY] = othersValue;
    }
    return datum;
  });

const orderMajorMarketsByPeak = (peakByMarket: Map<string, number>) =>
  [...peakByMarket.entries()]
    .filter(([, peak]) => peak >= OTHERS_THRESHOLD_DOLLARS)
    .sort((entryA, entryB) => entryB[1] - entryA[1])
    .map(([market]) => market);

interface TooltipPayloadItem {
  dataKey: unknown;
  value: number;
  color: string;
  payload: ChartDatum;
}

const HistoricalTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  marketMetaByAddress: Record<string, MarketMeta>;
  othersLabel: string;
}> = ({ active, payload, marketMetaByAddress, othersLabel }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  const breakdown = payload
    .map(item => {
      if (typeof item.dataKey !== 'string') {
        return null;
      }
      if (item.value === 0) {
        return null;
      }
      return {
        key: item.dataKey,
        value: item.value,
        color: item.color,
      };
    })
    .filter((item): item is { key: string; value: number; color: string } => !!item)
    .sort((itemA, itemB) => itemB.value - itemA.value);

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[240px]">
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-lightGrey">
        <span className="text-b2r text-grey">{formatTooltipDate(datum.timestamp)}</span>
        <span className="text-b2s text-white">{formatDollarsToCents(datum.total)}</span>
      </div>

      {breakdown.map(item => {
        const label =
          item.key === OTHERS_KEY
            ? othersLabel
            : marketMetaByAddress[item.key]?.symbol ?? item.key.slice(0, 8);
        return (
          <div key={item.key} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-b2r text-grey truncate">{label}</span>
            </div>
            <span className="text-b2s text-white whitespace-nowrap">
              {formatDollarsToCents(item.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export interface HistoricalMarketChartProps {
  metric: Metric;
}

export const HistoricalMarketChart: React.FC<HistoricalMarketChartProps> = ({ metric }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardMarketSnapshots({ kind: 'year' });
  const vTokens = useGetVTokens();
  const { colorByMarket } = useMarketColors();

  const marketMetaByAddress = useMemo(() => {
    const map: Record<string, MarketMeta> = {};
    for (const vToken of vTokens) {
      map[getAddress(vToken.address)] = { symbol: vToken.underlyingToken.symbol };
    }
    return map;
  }, [vTokens]);

  const peakByMarket = useMemo(
    () => (data ? computePeakByMarket(data.series, metric) : new Map<string, number>()),
    [data, metric],
  );

  const majorMarkets = useMemo(() => orderMajorMarketsByPeak(peakByMarket), [peakByMarket]);

  const majorMarketSet = useMemo(() => new Set(majorMarkets), [majorMarkets]);

  const chartData = useMemo(
    () => (data ? buildChartData(data.series, metric, market => majorMarketSet.has(market)) : []),
    [data, metric, majorMarketSet],
  );

  const hasOthers = useMemo(
    () => chartData.some(datum => typeof datum[OTHERS_KEY] === 'number'),
    [chartData],
  );

  const title = t(`statsPage.historicalMarketChart.${metric}.title`);
  const unavailableMessage = t(`statsPage.historicalMarketChart.${metric}.unavailable`);
  const noDataMessage = t(`statsPage.historicalMarketChart.${metric}.noData`);
  const othersLabel = t('statsPage.historicalMarketChart.others');

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-h6 text-white mb-4">{title}</h2>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{unavailableMessage}</p>
        ) : chartData.length === 0 ? (
          <p className="text-grey">{noDataMessage}</p>
        ) : (
          <ResponsiveContainer>
            <RCAreaChart data={chartData} margin={{ top: 16, left: 0, right: 8, bottom: 0 }}>
              <CartesianGrid stroke={theme.colors.lightGrey} strokeOpacity={0.3} vertical={false} />

              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                minTickGap={64}
                stroke={theme.colors.grey}
                tickFormatter={formatDateLabel}
                tick={{ fill: theme.colors.grey, fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={72}
                stroke={theme.colors.grey}
                domain={[0, roundUpToScale]}
                tick={({ payload, x, y }) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill={theme.colors.grey} fontSize={12}>
                    {formatDollarsToCents(payload.value)}
                  </text>
                )}
              />

              <Tooltip
                cursor={{ stroke: theme.colors.lightGrey, strokeOpacity: 0.5 }}
                content={
                  <HistoricalTooltip
                    marketMetaByAddress={marketMetaByAddress}
                    othersLabel={othersLabel}
                  />
                }
              />

              {majorMarkets.map(market => (
                <Area
                  key={market}
                  dataKey={market}
                  stackId="metric"
                  fill={colorByMarket[market] ?? theme.colors.grey}
                  fillOpacity={0.8}
                  stroke={colorByMarket[market] ?? theme.colors.grey}
                  strokeWidth={0}
                  isAnimationActive={false}
                />
              ))}

              {hasOthers && (
                <Area
                  key={OTHERS_KEY}
                  dataKey={OTHERS_KEY}
                  stackId="metric"
                  fill={theme.colors.grey}
                  fillOpacity={0.5}
                  stroke={theme.colors.grey}
                  strokeWidth={0}
                  isAnimationActive={false}
                />
              )}
            </RCAreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
