/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
  Tooltip,
} from 'recharts';

import { useTranslation } from 'translation';
import { formatToReadablePercentage } from 'utilities/common';
import TooltipContent from '../TooltipContent';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IInterestRateItem {
  utilizationRatePercentage: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export interface IInterestRateChartProps {
  data: IInterestRateItem[];
  className?: string;
}

export const InterestRateChart: React.FC<IInterestRateChartProps> = ({ className, data }) => {
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = {
    ...sharedStyles,
    ...localStyles,
  };

  const { t } = useTranslation();

  return (
    <div css={styles.container} className={className}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          // TODO: fix margins
        >
          <XAxis
            dataKey="utilizationRatePercentage"
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            stroke={styles.accessoryColor}
            tickMargin={styles.tickMargin}
            tickCount={5}
            type="number"
            style={styles.axis}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickMargin={styles.tickMargin}
            stroke={styles.accessoryColor}
            style={styles.axis}
            tickCount={10}
            dataKey="supplyApyPercentage"
          />
          <Tooltip
            isAnimationActive={false}
            cursor={styles.cursor}
            content={({ payload }) =>
              payload && payload[0] ? (
                <TooltipContent
                  items={[
                    {
                      label: t('interestRateChart.tooltipItemLabels.utilizationRate'),
                      value: formatToReadablePercentage(
                        (payload[0].payload as IInterestRateItem).utilizationRatePercentage,
                      ),
                    },
                    {
                      label: t('interestRateChart.tooltipItemLabels.borrowApy'),
                      value: formatToReadablePercentage(
                        (payload[0].payload as IInterestRateItem).borrowApyPercentage,
                      ),
                    },
                    {
                      label: t('interestRateChart.tooltipItemLabels.supplyApy'),
                      value: formatToReadablePercentage(
                        (payload[0].payload as IInterestRateItem).supplyApyPercentage,
                      ),
                    },
                  ]}
                />
              ) : null
            }
          />
          <CartesianGrid vertical={false} stroke={styles.gridLineColor} />
          <Line
            type="monotone"
            dataKey="borrowApyPercentage"
            stroke={styles.lineBorrowApyColor}
            strokeWidth={styles.lineStrokeWidth}
            isAnimationActive={false}
            activeDot={styles.lineActiveDot}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="supplyApyPercentage"
            stroke={styles.lineSupplyApyColor}
            strokeWidth={styles.lineStrokeWidth}
            activeDot={styles.lineActiveDot}
            isAnimationActive={false}
            dot={false}
          />
          <ReferenceLine y={90} stroke="blue" strokeWidth={styles.lineStrokeWidth} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
