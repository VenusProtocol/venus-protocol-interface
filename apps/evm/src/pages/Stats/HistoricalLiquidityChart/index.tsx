import { theme } from '@venusprotocol/ui';
import { useGetRiskDashboardMarketSnapshots } from 'clients/api';
import { Card, Spinner } from 'components';
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
import { roundUpToScale } from '../roundUpToScale';

interface ChartDatum {
  timestamp: number;
  blockNumber: string;
  liquidity: number;
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

interface TooltipPayloadItem {
  value: number;
  payload: ChartDatum;
}

const LiquidityTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  liquidityLabel: string;
}> = ({ active, payload, liquidityLabel }) => {
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
        <span className="text-b2r text-grey">{liquidityLabel}</span>
        <span className="text-b2s text-white">{formatDollarsToCents(datum.liquidity)}</span>
      </div>
    </div>
  );
};

export const HistoricalLiquidityChart: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardMarketSnapshots({ kind: 'year' });

  const chartData = useMemo<ChartDatum[]>(() => {
    if (!data) {
      return [];
    }
    return data.series.map(slot => {
      const supply = toDollars(slot.totalSupplyUsdCents);
      const borrows = toDollars(slot.totalBorrowsUsdCents);
      return {
        timestamp: new Date(slot.blockTimestamp).getTime(),
        blockNumber: slot.blockNumber,
        liquidity: supply - borrows,
      };
    });
  }, [data]);

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-h6 text-white mb-4">{t('statsPage.historicalLiquidity.title')}</h2>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{t('statsPage.historicalLiquidity.unavailable')}</p>
        ) : chartData.length === 0 ? (
          <p className="text-grey">{t('statsPage.historicalLiquidity.noData')}</p>
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
                  <LiquidityTooltip
                    liquidityLabel={t('statsPage.historicalLiquidity.tooltipLabel')}
                  />
                }
              />

              <Area
                dataKey="liquidity"
                fill={theme.colors.green}
                fillOpacity={0.4}
                stroke={theme.colors.green}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </RCAreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
