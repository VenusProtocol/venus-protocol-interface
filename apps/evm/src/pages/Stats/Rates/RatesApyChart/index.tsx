import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardRatesHistorySlot,
  useGetRiskDashboardRatesHistory,
} from 'clients/api';
import { Card, Spinner } from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart as RCLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  convertDecimalToPercentage,
  formatPercentageToReadableValue,
  formatToReadableDate,
} from 'utilities';
import { getAddress } from 'viem';
import { useMarketColors } from '../../useMarketColors';

type Metric = 'supply' | 'borrows';

interface ChartDatum {
  timestamp: number;
  blockNumber: string;
  [marketAddress: string]: number | string;
}

const readPointApyPercentage = (point: { supplyApy: number; borrowApy: number }, metric: Metric) =>
  convertDecimalToPercentage(metric === 'supply' ? point.supplyApy : point.borrowApy);

const collectMarketsByLatestApy = (series: ApiRiskDashboardRatesHistorySlot[], metric: Metric) => {
  const latestApyByMarket = new Map<string, number>();
  for (const slot of series) {
    for (const point of slot.byMarket) {
      latestApyByMarket.set(getAddress(point.marketAddress), readPointApyPercentage(point, metric));
    }
  }
  return [...latestApyByMarket.entries()]
    .sort((entryA, entryB) => entryB[1] - entryA[1])
    .map(([market]) => market);
};

const buildChartData = (series: ApiRiskDashboardRatesHistorySlot[], metric: Metric): ChartDatum[] =>
  series.map(slot => {
    const datum: ChartDatum = {
      timestamp: new Date(slot.blockTimestamp).getTime(),
      blockNumber: slot.blockNumber,
    };
    for (const point of slot.byMarket) {
      datum[getAddress(point.marketAddress)] = readPointApyPercentage(point, metric);
    }
    return datum;
  });

interface TooltipPayloadItem {
  dataKey: unknown;
  value: number;
  color: string;
  payload: ChartDatum;
}

const ApyTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  symbolByMarket: Record<string, string>;
}> = ({ active, payload, symbolByMarket }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  const breakdown = payload
    .map(item => {
      if (typeof item.dataKey !== 'string') {
        return null;
      }
      return { key: item.dataKey, value: item.value, color: item.color };
    })
    .filter((item): item is { key: string; value: number; color: string } => !!item)
    .sort((itemA, itemB) => itemB.value - itemA.value);

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-60">
      <div className="mb-2 pb-2 border-b border-lightGrey">
        <span className="text-b2r text-grey">
          {formatToReadableDate({ timestampMs: datum.timestamp, t })}
        </span>
      </div>

      {breakdown.map(item => (
        <div key={item.key} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-b2r text-grey truncate">
              {symbolByMarket[item.key] ?? item.key.slice(0, 8)}
            </span>
          </div>
          <span className="text-b2s text-white whitespace-nowrap">
            {formatPercentageToReadableValue(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export interface RatesApyChartProps {
  metric: Metric;
}

export const RatesApyChart: React.FC<RatesApyChartProps> = ({ metric }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardRatesHistory({ topTokens: true });
  const vTokens = useGetVTokens();
  const { colorByMarket } = useMarketColors();

  const symbolByMarket = useMemo(() => {
    const map: Record<string, string> = {};
    for (const vToken of vTokens) {
      map[getAddress(vToken.address)] = vToken.underlyingToken.symbol;
    }
    return map;
  }, [vTokens]);

  const markets = useMemo(
    () => (data ? collectMarketsByLatestApy(data.series, metric) : []),
    [data, metric],
  );

  const chartData = useMemo(
    () => (data ? buildChartData(data.series, metric) : []),
    [data, metric],
  );

  // t('statsPage.rates.apyChart.supply.title')
  // t('statsPage.rates.apyChart.supply.unavailable')
  // t('statsPage.rates.apyChart.supply.noData')
  // t('statsPage.rates.apyChart.borrows.title')
  // t('statsPage.rates.apyChart.borrows.unavailable')
  // t('statsPage.rates.apyChart.borrows.noData')
  const title = t(`statsPage.rates.apyChart.${metric}.title`);
  const unavailableMessage = t(`statsPage.rates.apyChart.${metric}.unavailable`);
  const noDataMessage = t(`statsPage.rates.apyChart.${metric}.noData`);

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
            <RCLineChart data={chartData} margin={{ top: 16, left: 0, right: 8, bottom: 0 }}>
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
                tickFormatter={(value: number) => formatToReadableDate({ timestampMs: value, t })}
                tick={{ fill: theme.colors.grey, fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={72}
                stroke={theme.colors.grey}
                tick={({ payload, x, y }) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill={theme.colors.grey} fontSize={12}>
                    {formatPercentageToReadableValue(payload.value)}
                  </text>
                )}
              />

              <Tooltip
                cursor={{ stroke: theme.colors.lightGrey, strokeOpacity: 0.5 }}
                content={<ApyTooltip symbolByMarket={symbolByMarket} />}
              />

              {markets.map(market => (
                <Line
                  key={market}
                  dataKey={market}
                  stroke={colorByMarket[market] ?? theme.colors.grey}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </RCLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
