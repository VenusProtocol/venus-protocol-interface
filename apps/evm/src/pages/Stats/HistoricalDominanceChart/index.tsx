import { theme } from '@venusprotocol/ui';
import { useGetRiskDashboardMarketSnapshots } from 'clients/api';
import { Card, Spinner } from 'components';
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

type Metric = 'supply' | 'borrows';

interface ChartDatum {
  timestamp: number;
  blockNumber: string;
  ratio: number;
}

const toDollars = (cents: string) => Number(cents) / 100;

const formatRatioPercent = (ratio: number) => `${(ratio * 100).toFixed(0)}%`;

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

interface TooltipPayloadItem {
  value: number;
  payload: ChartDatum;
}

const DominanceTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  ratioLabel: string;
}> = ({ active, payload, ratioLabel }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[200px]">
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-lightGrey">
        <span className="text-b2r text-grey">{formatTooltipDate(datum.timestamp)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">{ratioLabel}</span>
        <span className="text-b2s text-white">{formatRatioPercent(datum.ratio)}</span>
      </div>
    </div>
  );
};

export interface HistoricalDominanceChartProps {
  metric: Metric;
}

export const HistoricalDominanceChart: React.FC<HistoricalDominanceChartProps> = ({ metric }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardMarketSnapshots({ kind: 'year' });

  const chartData = useMemo<ChartDatum[]>(() => {
    if (!data) {
      return [];
    }
    const points: ChartDatum[] = [];
    for (const slot of data.series) {
      const supply = toDollars(slot.totalSupplyUsdCents);
      const borrows = toDollars(slot.totalBorrowsUsdCents);
      const liquidity = supply - borrows;
      if (liquidity <= 0) {
        continue;
      }
      const numerator = metric === 'supply' ? supply : borrows;
      points.push({
        timestamp: new Date(slot.blockTimestamp).getTime(),
        blockNumber: slot.blockNumber,
        ratio: numerator / liquidity,
      });
    }
    return points;
  }, [data, metric]);

  const title = t(`statsPage.historicalDominance.${metric}.title`);
  const unavailableMessage = t(`statsPage.historicalDominance.${metric}.unavailable`);
  const noDataMessage = t(`statsPage.historicalDominance.${metric}.noData`);
  const ratioLabel = t(`statsPage.historicalDominance.${metric}.ratioLabel`);
  const lineColor = metric === 'supply' ? theme.colors.blue : theme.colors.red;

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
                tickFormatter={formatDateLabel}
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
                    {formatRatioPercent(payload.value)}
                  </text>
                )}
              />

              <Tooltip
                cursor={{ stroke: theme.colors.lightGrey, strokeOpacity: 0.5 }}
                content={<DominanceTooltip ratioLabel={ratioLabel} />}
              />

              <Line
                dataKey="ratio"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </RCLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
