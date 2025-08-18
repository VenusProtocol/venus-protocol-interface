import { cn, theme } from '@venusprotocol/ui';
import { ChartTooltipContent, type ChartTooltipContentItem, ChartYAxisTick } from 'components';
import { useUID } from 'react-uid';
import {
  Area,
  CartesianGrid,
  AreaChart as RCAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DataKey } from 'recharts/types/util/types';

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

export const AreaChart = <T extends Record<string, any>>({
  className,
  data,
  chartColor,
  interval,
  xAxisDataKey,
  yAxisDataKey,
  yAxisTickCount = 6,
  formatXAxisValue,
  formatYAxisValue,
  formatTooltipItems,
  onDataPointHover,
  onMouseLeave,
}: ChartProps<T>) => {
  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <div className={cn('w-full h-62', className)}>
      <ResponsiveContainer>
        <RCAreaChart
          margin={{
            top: 20,
            left: -14,
            right: 4,
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

          <CartesianGrid vertical={false} stroke={theme.colors.lightGrey} strokeDasharray="2 2" />

          <XAxis
            dataKey={xAxisDataKey}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatXAxisValue}
            stroke={theme.colors.grey}
            tickMargin={8}
            tickCount={data.length}
            interval={typeof interval === 'number' ? Math.round(data.length / interval) : undefined}
            className="text-xs"
          />

          <YAxis
            dataKey={yAxisDataKey}
            axisLine={false}
            tickLine={false}
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
            cursor={{ strokeDasharray: '4px 4px', stroke: theme.colors.grey }}
            content={({ payload }) =>
              formatTooltipItems && payload?.[0]?.payload ? (
                <ChartTooltipContent items={formatTooltipItems(payload[0].payload)} />
              ) : null
            }
          />

          <Area
            isAnimationActive={false}
            dataKey={yAxisDataKey}
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 8, strokeWidth: 4 }}
          />
        </RCAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
