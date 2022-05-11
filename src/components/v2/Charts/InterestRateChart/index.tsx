/** @jsxImportSource @emotion/react */
import React from 'react';
import { ResponsiveContainer, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

// import { useTranslation } from 'translation';
import { formatToReadablePercentage } from 'utilities/common';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IInterestRateItem {
  utilizationPercentage: number;
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

  return (
    <div css={styles.container} className={className}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          // TODO: fix margins
        >
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatToReadablePercentage}
            tickMargin={styles.tickMargin}
            stroke={styles.accessoryColor}
            style={styles.axis}
            domain={[0, 'dataMax + 10']}
          />
          <CartesianGrid vertical={false} stroke={styles.gridLineColor} />
          <Line
            type="monotone"
            dataKey="borrowApyPercentage"
            stroke={styles.lineBorrowApyColor}
            strokeWidth={styles.lineStrokeWidth}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="supplyApyPercentage"
            stroke={styles.lineSupplyApyColor}
            strokeWidth={styles.lineStrokeWidth}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
