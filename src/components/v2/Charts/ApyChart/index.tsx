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
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { formatToReadablePercentage, formatCentsToReadableValue } from 'utilities/common';
import formatToReadableDate from './formatToReadableDate';
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
  const styles = {
    ...sharedStyles,
    ...localStyles,
  };

  const chartColor = type === 'supply' ? styles.supplyChartColor : styles.borrowChartColor;
  const { Trans } = useTranslation();

  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <div css={styles.container} className={className}>
      <ResponsiveContainer>
        <AreaChart margin={styles.chartMargin} data={data}>
          {/* Gradient used as filler */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke={styles.gridLineColor} />
          <XAxis
            dataKey="timestampMs"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadableDate}
            stroke={styles.accessoryColor}
            tickMargin={styles.tickMargin}
            tickCount={7}
            style={styles.axis}
          />
          <YAxis
            dataKey="apyPercentage"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickMargin={styles.tickMargin}
            tickCount={6}
            stroke={styles.accessoryColor}
            style={styles.axis}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={styles.cursor}
            content={({ payload }) =>
              payload && payload[0] ? (
                <div css={styles.tooltipContainer}>
                  <div css={styles.tooltipItem}>
                    <Trans
                      i18nKey={
                        // Translation keys: do not remove this comment
                        // t('apyChart.tooltipItems.supplyApy')
                        // t('apyChart.tooltipItems.borrowApy')
                        type === 'supply'
                          ? 'apyChart.tooltipItems.supplyApy'
                          : 'apyChart.tooltipItems.borrowApy'
                      }
                      components={{
                        Label: <Typography css={styles.tooltipItemLabel} variant="tiny" />,
                        Value: <Typography css={styles.tooltipItemValue} variant="small1" />,
                      }}
                      values={{
                        percentage: formatToReadablePercentage(
                          (payload[0].payload as IApyChartItem).apyPercentage,
                        ),
                      }}
                    />
                  </div>

                  <div css={styles.tooltipItem}>
                    <Trans
                      i18nKey={
                        // Translation keys: do not remove this comment
                        // t('apyChart.tooltipItems.totalSupply')
                        // t('apyChart.tooltipItems.totalBorrow')
                        type === 'supply'
                          ? 'apyChart.tooltipItems.totalSupply'
                          : 'apyChart.tooltipItems.totalBorrow'
                      }
                      components={{
                        Label: <Typography css={styles.tooltipItemLabel} variant="tiny" />,
                        Value: <Typography css={styles.tooltipItemValue} variant="small1" />,
                      }}
                      values={{
                        balance: formatCentsToReadableValue({
                          value: (payload[0].payload as IApyChartItem).balanceCents,
                          shorthand: true,
                        }),
                      }}
                    />
                  </div>
                </div>
              ) : null
            }
          />
          <Area
            isAnimationActive={false}
            dataKey="apyPercentage"
            stroke={chartColor}
            strokeWidth={styles.lineStrokeWidth}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={styles.activeDot}
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
