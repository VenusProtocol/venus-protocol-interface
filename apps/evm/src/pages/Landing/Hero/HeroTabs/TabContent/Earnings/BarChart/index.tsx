import { cn, theme } from '@venusprotocol/ui';
import { Bar, BarChart as RCBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartYAxisTick, Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import type { CompoundedAmountDataPoint } from '../../types';

const X_AXIS_DATA_KEY: keyof CompoundedAmountDataPoint = 'months';
const Y_AXIS_DATA_KEY: keyof CompoundedAmountDataPoint = 'earningsCents';
const INTERVAL = 6;

export interface ChartProps {
  data: CompoundedAmountDataPoint[];
  className?: string;
}

export const BarChart: React.FC<ChartProps> = ({ className, data }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('w-full h-47.5', className)}>
      <ResponsiveContainer>
        <RCBarChart
          margin={{
            top: 0,
            left: 0,
            right: 0,
          }}
          data={data}
          barGap={'8%'}
        >
          <Bar
            dataKey={Y_AXIS_DATA_KEY}
            fill={'#181D27'}
            activeBar={{ fill: theme.colors.blue, stroke: theme.colors.blue }}
            radius={[9999, 9999, 9999, 9999]}
          />

          <XAxis
            dataKey={X_AXIS_DATA_KEY}
            axisLine={false}
            tickLine={false}
            hide={true}
            tickFormatter={value => value}
            stroke={theme.colors.grey}
            tickMargin={2}
            tickCount={data.length}
            interval={Math.round(data.length / INTERVAL)}
            className="text-xs"
          />

          <YAxis
            dataKey={Y_AXIS_DATA_KEY}
            axisLine={false}
            tickLine={false}
            hide={true}
            tickMargin={8}
            tick={({ payload, y }) => (
              <ChartYAxisTick
                value={formatCentsToReadableValue({
                  value: payload.value,
                })}
                y={y}
              />
            )}
            tickCount={INTERVAL}
            stroke={theme.colors.grey}
            className="text-xs text-left"
          />

          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: 'transparent', fill: 'transparent' }}
            content={({ payload }) => {
              const dataPoint: CompoundedAmountDataPoint | undefined = payload?.[0]?.payload;

              if (dataPoint) {
                return (
                  <div className="p-3 rounded-lg text-light-grey bg-background backdrop-blur-xs text-b1s">
                    <div className="flex items-center font-semibold">
                      <div>{t('landing.hero.monthNo', { number: dataPoint.months })}</div>
                    </div>

                    <div className="flex items-center mt-2.5">
                      <Icon className="size-5" name="dollar" />

                      <div className="ms-3 me-1">
                        {t('landing.hero.earnedAmount', {
                          amount: formatCentsToReadableValue({ value: dataPoint.earningsCents }),
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
            }}
          />
        </RCBarChart>
      </ResponsiveContainer>
    </div>
  );
};
