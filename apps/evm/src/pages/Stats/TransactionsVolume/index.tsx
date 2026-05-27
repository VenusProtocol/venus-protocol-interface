import { theme } from '@venusprotocol/ui';
import {
  type ApiRiskDashboardTransactionsVolumeDay,
  useGetRiskDashboardTransactionsVolume,
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
import { roundUpToScale } from '../roundUpToScale';

type TxKind = 'mint' | 'redeem' | 'borrow' | 'repay' | 'liquidate';

const KIND_TRANSLATION_KEY: Record<TxKind, string> = {
  mint: 'statsPage.transactionsVolume.legend.mint',
  redeem: 'statsPage.transactionsVolume.legend.redeem',
  borrow: 'statsPage.transactionsVolume.legend.borrow',
  repay: 'statsPage.transactionsVolume.legend.repay',
  liquidate: 'statsPage.transactionsVolume.legend.liquidate',
};

const KIND_COLOR: Record<TxKind, string> = {
  mint: theme.colors.green,
  redeem: theme.colors.red,
  borrow: theme.colors.blue,
  repay: theme.colors.yellow,
  liquidate: theme.colors.orange,
};

const KINDS: TxKind[] = ['mint', 'redeem', 'borrow', 'repay', 'liquidate'];

const isTxKind = (value: unknown): value is TxKind =>
  value === 'mint' ||
  value === 'redeem' ||
  value === 'borrow' ||
  value === 'repay' ||
  value === 'liquidate';

interface ChartDatum {
  day: string;
  mint: number;
  redeem: number;
  borrow: number;
  repay: number;
  liquidate: number;
  total: number;
}

const toDollars = (cents: string) => Number(cents) / 100;

const formatDayShort = (day: string) => {
  const date = new Date(`${day}T00:00:00Z`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const buildChartData = (series: ApiRiskDashboardTransactionsVolumeDay[]): ChartDatum[] =>
  series.map(day => ({
    day: day.day,
    mint: toDollars(day.mintUsdCents),
    redeem: toDollars(day.redeemUsdCents),
    borrow: toDollars(day.borrowUsdCents),
    repay: toDollars(day.repayUsdCents),
    liquidate: toDollars(day.liquidateUsdCents),
    total: toDollars(day.totalUsdCents),
  }));

const formatDollarsToCents = (dollars: number) =>
  formatCentsToReadableValue({ value: Math.round(dollars * 100) });

interface TooltipPayloadItem {
  dataKey: unknown;
  value: number;
  color: string;
}

const TransactionsVolumeTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}> = ({ active, payload, label }) => {
  const { t } = useTranslation();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const total = payload.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-3 rounded-lg bg-background border border-lightGrey min-w-[160px]">
      <p className="text-b2s text-grey mb-2">{label}</p>

      {[...payload].reverse().map(item => {
        if (!isTxKind(item.dataKey)) {
          return null;
        }
        return (
          <div key={item.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-b2r text-grey">{t(KIND_TRANSLATION_KEY[item.dataKey])}</span>
            </div>
            <span className="text-b2s text-white">{formatDollarsToCents(item.value)}</span>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-2 mt-2 border-t border-lightGrey">
        <span className="text-b2s text-grey">{t('statsPage.transactionsVolume.tooltipTotal')}</span>
        <span className="text-b1s text-white">{formatDollarsToCents(total)}</span>
      </div>
    </div>
  );
};

const Legend: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {KINDS.map(kind => (
        <div key={kind} className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: KIND_COLOR[kind] }}
          />
          <span className="text-b2r text-grey">{t(KIND_TRANSLATION_KEY[kind])}</span>
        </div>
      ))}
    </div>
  );
};

export interface TransactionsVolumeProps {
  days?: number;
}

export const TransactionsVolume: React.FC<TransactionsVolumeProps> = ({ days = 30 }) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardTransactionsVolume({ days });

  const chartData = data ? buildChartData(data.series) : [];

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h2 className="text-h6 text-white">{t('statsPage.transactionsVolume.title')}</h2>
        {data && (
          <span className="text-b1r text-grey">
            {t('statsPage.transactionsVolume.subtitle', {
              days: data.days,
              total: formatCentsToReadableValue({ value: data.totalUsdCents }),
            })}
          </span>
        )}
      </div>

      <div className="mb-4">
        <Legend />
      </div>

      <div className="w-full h-100 flex items-center justify-center">
        {isLoading ? (
          <Spinner />
        ) : isError || !data ? (
          <p className="text-grey">{t('statsPage.transactionsVolume.unavailable')}</p>
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
                className="text-xs"
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={56}
                stroke={theme.colors.grey}
                domain={[0, roundUpToScale]}
                tick={({ payload, x, y }) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fill={theme.colors.grey} fontSize={12}>
                    {formatDollarsToCents(payload.value)}
                  </text>
                )}
              />

              <Tooltip
                cursor={{ fill: theme.colors.lightGrey, fillOpacity: 0.1 }}
                content={<TransactionsVolumeTooltip />}
              />

              {KINDS.map(kind => (
                <Bar
                  key={kind}
                  dataKey={kind}
                  stackId="vol"
                  fill={KIND_COLOR[kind]}
                  radius={kind === 'liquidate' ? [4, 4, 0, 0] : 0}
                />
              ))}
            </RCBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
