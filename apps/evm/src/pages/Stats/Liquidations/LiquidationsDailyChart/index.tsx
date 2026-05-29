import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardLiquidationsDailyDay,
  useGetRiskDashboardLiquidationsDaily,
} from 'clients/api';
import { Card, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import {
  Bar,
  CartesianGrid,
  BarChart as RCBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCentsToReadableValue } from 'utilities';
import { roundUpToScale } from '../../roundUpToScale';

interface ChartDatum {
  day: string;
  count: number;
  debtRepaidUsdCents: string;
  collateralSeizedUsdCents: string;
  activeLiquidators: string;
}

const formatDayShort = (day: string) => {
  const date = new Date(`${day}T00:00:00Z`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const buildChartData = (series: ApiRiskDashboardLiquidationsDailyDay[]): ChartDatum[] =>
  series.map(day => ({
    day: day.day,
    count: Number(day.count),
    debtRepaidUsdCents: day.debtRepaidUsdCents,
    collateralSeizedUsdCents: day.collateralSeizedUsdCents,
    activeLiquidators: day.activeLiquidators,
  }));

interface TooltipPayloadItem {
  payload: ChartDatum;
}

const DailyTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
}> = ({ active, payload }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const datum = payload[0].payload;

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[200px]">
      <p className="text-b2s text-grey mb-2">{formatDayShort(datum.day)}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.dailyChart.tooltip.count')}
        </span>
        <span className="text-b2s text-white">{datum.count}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.dailyChart.tooltip.debtRepaid')}
        </span>
        <span className="text-b2s text-white">
          {formatCentsToReadableValue({ value: datum.debtRepaidUsdCents })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.dailyChart.tooltip.collateralSeized')}
        </span>
        <span className="text-b2s text-white">
          {formatCentsToReadableValue({ value: datum.collateralSeizedUsdCents })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-b2r text-grey">
          {t('statsPage.liquidations.dailyChart.tooltip.activeLiquidators')}
        </span>
        <span className="text-b2s text-white">{datum.activeLiquidators}</span>
      </div>
    </div>
  );
};

export interface LiquidationsDailyChartProps {
  days: number;
}

export const LiquidationsDailyChart: React.FC<LiquidationsDailyChartProps> = ({ days }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardLiquidationsDaily({ days });
  const chartData = data ? buildChartData(data.series) : [];

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-h6 text-white mb-4">{t('statsPage.liquidations.dailyChart.title')}</h2>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{t('statsPage.liquidations.dailyChart.unavailable')}</p>
        ) : chartData.length === 0 ? (
          <p className="text-grey">{t('statsPage.liquidations.dailyChart.noData')}</p>
        ) : (
          <ResponsiveContainer>
            <RCBarChart data={chartData} margin={{ top: 20, left: 0, right: 8, bottom: 0 }}>
              <CartesianGrid stroke={theme.colors.lightGrey} strokeOpacity={0.3} vertical={false} />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDayShort}
                stroke={theme.colors.grey}
                tickMargin={8}
                minTickGap={48}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={48}
                stroke={theme.colors.grey}
                domain={[0, roundUpToScale]}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ fill: theme.colors.lightGrey, fillOpacity: 0.1 }}
                content={<DailyTooltip />}
              />

              <Bar dataKey="count" fill={theme.colors.red} radius={[4, 4, 0, 0]} />
            </RCBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
