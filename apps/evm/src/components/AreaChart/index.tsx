import { cn, theme } from '@venusprotocol/ui';
import { ChartTooltipContent, type ChartTooltipContentItem, ChartYAxisTick } from 'components';
import { useUID } from 'react-uid';
import {
  Area,
  AreaChart as RCAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DataKey, Margin } from 'recharts/types/util/types';

import { getRoundedYAxisTicks } from './getRoundedYAxisTicks';
import { getXAxisTicks } from './getXAxisTicks';
import { getYAxisTicks } from './getYAxisTicks';

export interface AreaChartProps<T extends Record<string, any>> {
  data: T[];
  xAxisDataKey: DataKey<T>;
  yAxisDataKey: DataKey<T>;
  chartColor: string;
  variant?: 'area' | 'line';
  formatXAxisValue: (value: any) => string;
  formatYAxisValue: (value: any) => string;
  yAxisTickCount?: number;
  onDataPointHover?: (value: T) => void;
  onMouseLeave?: () => void;
  formatTooltipItems?: (value: T) => ChartTooltipContentItem[];
  areaChartMargin?: Margin;
  /** Maximum number of labels to display on the X axis. */
  interval?: number;
  displayAxes?: boolean;
  displayToolTip?: boolean;
  className?: string;
}

export const AreaChart = <T extends Record<string, any>>({
  className,
  data,
  chartColor,
  variant = 'area',
  interval,
  xAxisDataKey,
  yAxisDataKey,
  yAxisTickCount = 6,
  formatXAxisValue,
  formatYAxisValue,
  formatTooltipItems,
  onDataPointHover,
  onMouseLeave,
  displayAxes = true,
  displayToolTip = true,
  areaChartMargin,
}: AreaChartProps<T>) => {
  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;
  const xAxisTicks = getXAxisTicks({ data, interval, xAxisDataKey, formatValue: formatXAxisValue });
  const isLine = variant === 'line';
  const yAxisTicks = isLine
    ? getRoundedYAxisTicks(data.map(dataPoint => Number(dataPoint[yAxisDataKey as keyof T])))
    : getYAxisTicks({
        data,
        tickCount: yAxisTickCount,
        yAxisDataKey,
        formatValue: formatYAxisValue,
      });

  let yAxisDomain: [number | string, number | string] = ['auto', 'auto'];

  if (isLine && yAxisTicks) {
    yAxisDomain = [yAxisTicks[0], yAxisTicks[yAxisTicks.length - 1]];
  } else if (yAxisTicks) {
    yAxisDomain = ['dataMin', 'dataMax'];
  }

  return (
    <div className={cn('w-full h-62', className)}>
      <ResponsiveContainer>
        <RCAreaChart
          margin={{
            top: 20,
            left: -14,
            right: 4,
            ...areaChartMargin,
          }}
          data={data}
          onMouseLeave={onMouseLeave}
          onMouseMove={e => {
            if (e.activePayload) {
              onDataPointHover?.(e.activePayload[0].payload);
            }
          }}
        >
          {/* Gradient used as filler */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {displayAxes && (
            <XAxis
              dataKey={xAxisDataKey}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatXAxisValue}
              stroke={theme.colors.grey}
              tickMargin={isLine ? 12 : 8}
              tickCount={xAxisTicks?.length ?? data.length}
              ticks={xAxisTicks}
              interval={xAxisTicks ? 0 : undefined}
              padding={{ left: 0, right: isLine ? 0 : 24 }}
              className="text-xs"
              {...(isLine && {
                tick: ({ x, y, index, visibleTicksCount, payload }) => {
                  let textAnchor: 'start' | 'middle' | 'end' = 'middle';

                  if (index === 0) {
                    textAnchor = 'start';
                  } else if (index === visibleTicksCount - 1) {
                    textAnchor = 'end';
                  }

                  return (
                    <text
                      x={x}
                      y={y}
                      dy={12}
                      textAnchor={textAnchor}
                      fill={theme.colors.grey}
                      className="text-xs"
                    >
                      {formatXAxisValue(payload.value)}
                    </text>
                  );
                },
              })}
            />
          )}

          {displayAxes && (
            <YAxis
              dataKey={yAxisDataKey}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tick={({ payload, y }) => (
                <ChartYAxisTick value={formatYAxisValue(payload.value)} y={y} />
              )}
              ticks={yAxisTicks}
              tickCount={yAxisTickCount}
              stroke={theme.colors.grey}
              className="text-xs text-left"
              domain={yAxisDomain}
            />
          )}

          {displayToolTip && (
            <Tooltip
              isAnimationActive={false}
              cursor={{ strokeDasharray: '4px 4px', stroke: theme.colors.grey }}
              content={({ payload }) =>
                formatTooltipItems && payload?.[0]?.payload ? (
                  <ChartTooltipContent items={formatTooltipItems(payload[0].payload)} />
                ) : null
              }
            />
          )}

          <Area
            type={isLine ? 'linear' : undefined}
            isAnimationActive={false}
            dataKey={yAxisDataKey}
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={isLine ? { r: 4, strokeWidth: 2 } : { r: 8, strokeWidth: 4 }}
          />
        </RCAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
