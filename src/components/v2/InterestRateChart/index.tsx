/** @jsxImportSource @emotion/react */
import React from 'react';
import { ResponsiveContainer, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

// import { useTranslation } from 'translation';
import { formatToReadablePercentage } from 'utilities/common';
import { useStyles } from './styles';

export interface IItem {
  utilizationRate: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export interface IInterestRateChartProps {
  data: IItem[];
  className?: string;
}

export const InterestRateChart: React.FC<IInterestRateChartProps> = ({ className, data }) => {
  const styles = useStyles();

  console.log(data);

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
          <Line type="monotone" dataKey="borrowApyPercentage" stroke="#8884d8" />
          <Line type="monotone" dataKey="supplyApyPercentage" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
