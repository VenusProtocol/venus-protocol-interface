/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import {
  AreaChart,
  Tooltip,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { useUID } from 'react-uid';

import { useTranslation } from 'translation';
import { formatToReadablePercentage, formatCentsToReadableValue } from 'utilities';
import formatToReadableDate from './formatToReadableDate';
import TooltipContent from '../TooltipContent';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IApyChartItem {
  apyPercentage: number;
  timestampMs: number;
  balanceCents: BigNumber;
}

export interface IApyChartProps {
  data: IApyChartItem[];
  type: 'supply' | 'borrow';
  className?: string;
}

export const ApyChart: React.FC<IApyChartProps> = ({ className, data, type }) => {
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();

  const chartColor =
    type === 'supply' ? localStyles.supplyChartColor : localStyles.borrowChartColor;
  const { t } = useTranslation();

  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <div css={sharedStyles.container} className={className}>
      <ResponsiveContainer>
        <AreaChart margin={sharedStyles.chartMargin} data={data}>
          {/* Gradient used as filler */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke={sharedStyles.gridLineColor} />
          <XAxis
            dataKey="timestampMs"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadableDate}
            stroke={sharedStyles.accessoryColor}
            tickMargin={sharedStyles.tickMargin}
            tickCount={30}
            interval={3}
            style={sharedStyles.axis}
          />
          <YAxis
            dataKey="apyPercentage"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickMargin={sharedStyles.tickMargin}
            tickCount={6}
            stroke={sharedStyles.accessoryColor}
            style={sharedStyles.axis}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={sharedStyles.cursor}
            content={({ payload }) =>
              payload && payload[0] ? (
                <TooltipContent
                  items={[
                    {
                      label:
                        type === 'supply'
                          ? t('apyChart.tooltipItemLabels.supplyApy')
                          : t('apyChart.tooltipItemLabels.borrowApy'),
                      value: formatToReadablePercentage(
                        (payload[0].payload as IApyChartItem).apyPercentage,
                      ),
                    },
                    {
                      label:
                        type === 'supply'
                          ? t('apyChart.tooltipItemLabels.totalSupply')
                          : t('apyChart.tooltipItemLabels.totalBorrow'),
                      value: formatCentsToReadableValue({
                        value: (payload[0].payload as IApyChartItem).balanceCents,
                      }),
                    },
                  ]}
                />
              ) : null
            }
          />
          <Area
            isAnimationActive={false}
            dataKey="apyPercentage"
            stroke={chartColor}
            strokeWidth={sharedStyles.lineStrokeWidth}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={localStyles.areaActiveDot}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SupplyApyChart: React.FC<Omit<IApyChartProps, 'type'>> = props => (
  <ApyChart type="supply" {...props} />
);
export const BorrowApyChart: React.FC<Omit<IApyChartProps, 'type'>> = props => (
  <ApyChart type="borrow" {...props} />
);
