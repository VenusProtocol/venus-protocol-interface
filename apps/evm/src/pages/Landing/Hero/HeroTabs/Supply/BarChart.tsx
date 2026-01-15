import { cn, theme } from '@venusprotocol/ui';
import { type ChartTooltipContentItem, ChartYAxisTick } from 'components';
import { useTranslation } from 'libs/translations';
import {
  // Area,
  Bar,
  BarChart as RCBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DataKey } from 'recharts/types/util/types';
import { DEFAULT_AMOUNT } from '.';
import IconUSD from './usd.svg?react';

export interface ChartProps<T extends Record<string, any>> {
  data: T[];
  xAxisDataKey: DataKey<T>;
  yAxisDataKey: DataKey<T>;
  chartColor: string;
  formatXAxisValue: (value: any) => string;
  formatYAxisValue: (value: any) => string;
  yAxisTickCount?: number;
  onDataPointHover?: (value: T) => void;
  onMouseLeave?: () => void;
  formatTooltipItems?: (value: T) => ChartTooltipContentItem[];
  interval?: number;
  className?: string;
}

export const BarChart = <T extends Record<string, any>>({
  className,
  data,
  interval,
  xAxisDataKey,
  yAxisDataKey,
  yAxisTickCount = 6,
  formatXAxisValue,
  formatYAxisValue,
  // formatTooltipItems,
  onDataPointHover,
  onMouseLeave,
}: ChartProps<T>) => {
  const { t } = useTranslation();

  return (
    <div className={cn('w-full h-62', className)}>
      <ResponsiveContainer>
        <RCBarChart
          margin={{
            top: 12,
            left: 0,
            right: 0,
          }}
          data={data}
          onMouseLeave={onMouseLeave}
          onMouseMove={e => {
            if (e.activePayload) {
              onDataPointHover?.(e.activePayload[0].payload);
            }
          }}
          barGap={'8%'}
        >
          <Bar
            dataKey="amount"
            fill="#181D27"
            activeBar={{ fill: '#1199FA', stroke: '#1199FA' }}
            radius={[9999, 9999, 9999, 9999]}
          />
          <XAxis
            dataKey={xAxisDataKey}
            axisLine={false}
            tickLine={false}
            hide={true}
            tickFormatter={formatXAxisValue}
            stroke={theme.colors.grey}
            tickMargin={2}
            tickCount={data.length}
            interval={typeof interval === 'number' ? Math.round(data.length / interval) : undefined}
            className="text-xs"
          />

          <YAxis
            dataKey={yAxisDataKey}
            axisLine={false}
            tickLine={false}
            hide={true}
            tickMargin={8}
            tick={({ payload, y }) => (
              <ChartYAxisTick value={formatYAxisValue(payload.value)} y={y} />
            )}
            tickCount={yAxisTickCount}
            stroke={theme.colors.grey}
            className="text-xs text-left"
          />

          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: 'transparent', fill: 'transparent' }}
            content={({ payload }) => {
              const data = payload?.[0]?.payload;
              if (!data) return null;
              return (
                <div className="p-3 rounded-lg text-light-grey bg-background backdrop-blur-xs text-[16px] leading-[1.2] font-normal">
                  <div className="flex items-center font-semibold">
                    <div>{t('landing.hero.monthNo', { number: data.month })}</div>
                  </div>
                  <div className="flex items-center mt-2.5">
                    <IconUSD className="size-5" />
                    <div className="ms-3 me-1">
                      {t('landing.hero.earnedAmount', { amount: data.amount })}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </RCBarChart>
      </ResponsiveContainer>
    </div>
  );
};
