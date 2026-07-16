import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardStablecoinRatesSlot,
  useGetRiskDashboardStablecoinRates,
} from 'clients/api';
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
import {
  convertDecimalToPercentage,
  formatPercentageToReadableValue,
  formatToReadableDate,
} from 'utilities';

interface ChartDatum {
  timestamp: number;
  blockNumber: string;
  supplyApyPercentage: number;
  borrowApyPercentage: number;
}

const buildChartData = (series: ApiRiskDashboardStablecoinRatesSlot[]): ChartDatum[] =>
  series.map(slot => ({
    timestamp: new Date(slot.blockTimestamp).getTime(),
    blockNumber: slot.blockNumber,
    supplyApyPercentage: convertDecimalToPercentage(slot.supplyApy),
    borrowApyPercentage: convertDecimalToPercentage(slot.borrowApy),
  }));

interface TooltipPayloadItem {
  payload: ChartDatum;
}

const RatesTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
}> = ({ active, payload }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-55">
      <div className="mb-2 pb-2 border-b border-lightGrey">
        <span className="text-b2r text-grey">
          {formatToReadableDate({ timestampMs: datum.timestamp, t })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: theme.colors.blue }}
          />
          <span className="text-b2r text-grey">
            {t('statsPage.rates.stablecoinRates.supplyLabel')}
          </span>
        </div>
        <span className="text-b2s text-white">
          {formatPercentageToReadableValue(datum.supplyApyPercentage)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: theme.colors.red }}
          />
          <span className="text-b2r text-grey">
            {t('statsPage.rates.stablecoinRates.borrowLabel')}
          </span>
        </div>
        <span className="text-b2s text-white">
          {formatPercentageToReadableValue(datum.borrowApyPercentage)}
        </span>
      </div>
    </div>
  );
};

export const StablecoinRatesChart: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardStablecoinRates();

  const chartData = useMemo(() => (data ? buildChartData(data.series) : []), [data]);

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-h6 text-white mb-4">{t('statsPage.rates.stablecoinRates.title')}</h2>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{t('statsPage.rates.stablecoinRates.unavailable')}</p>
        ) : chartData.length === 0 ? (
          <p className="text-grey">{t('statsPage.rates.stablecoinRates.noData')}</p>
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
                content={<RatesTooltip />}
              />

              <Line
                dataKey="supplyApyPercentage"
                stroke={theme.colors.blue}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                dataKey="borrowApyPercentage"
                stroke={theme.colors.red}
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
