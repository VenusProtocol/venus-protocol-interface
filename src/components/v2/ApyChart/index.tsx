/** @jsxImportSource @emotion/react */
import React from 'react';
import { AreaChart, Tooltip, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useUID } from 'react-uid';

import { formatToReadableDate } from 'utilities';
import { formatToReadablePercentage } from 'utilities/common';
import { useStyles } from './styles';

export interface IItem {
  apy: number;
  timestamp: Date;
}

export interface IApyChartProps {
  data: IItem[];
  color?: string;
  className?: string;
}

// TODO: pass data through props

export const ApyChart: React.FC<IApyChartProps> = ({ className, color, data }) => {
  const styles = useStyles();
  const chartColor = color || styles.defaultChartColor;

  const chartData = React.useMemo(
    () =>
      data.map(({ timestamp, apy }) => ({
        name: formatToReadableDate(timestamp),
        apy,
      })),
    [JSON.stringify(data)],
  );

  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <AreaChart
      className={className}
      // TODO: fix
      width={700}
      height={350}
      data={chartData}
    >
      {/* Gradient used as filler */}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
          <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid vertical={false} stroke={styles.gridLineColor} />
      <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={styles.accessoryColor} />
      {/* TODO: set domain based on data (with maximum starting at 100) */}
      <YAxis
        axisLine={false}
        tickLine={false}
        tickFormatter={formatToReadablePercentage}
        stroke={styles.accessoryColor}
        domain={[0, 50]}
      />
      <Tooltip isAnimationActive={false} cursor={styles.cursor} />
      <Area
        dataKey="apy"
        stroke={chartColor}
        strokeWidth={styles.areaStrokeWidth}
        fillOpacity={1}
        fill={`url(#${gradientId})`}
        activeDot={styles.areaActiveDot}
      />
    </AreaChart>
  );
};
