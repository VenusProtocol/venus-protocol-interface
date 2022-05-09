/** @jsxImportSource @emotion/react */
import React from 'react';
import { AreaChart, Tooltip, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useUID } from 'react-uid';

import { useStyles } from './styles';

export interface IApyChartProps {
  color?: string;
  className?: string;
}

const data = [
  {
    name: 'Page A',
    uv: 40,
  },
  {
    name: 'Page B',
    uv: 30,
  },
  {
    name: 'Page C',
    uv: 20,
  },
  {
    name: 'Page D',
    uv: 27,
  },
  {
    name: 'Page E',
    uv: 18,
  },
  {
    name: 'Page F',
    uv: 23,
  },
  {
    name: 'Page G',
    uv: 34,
  },
];

// TODO: pass data through props

export const ApyChart: React.FC<IApyChartProps> = ({ className, color }) => {
  const styles = useStyles();
  const chartColor = color || styles.defaultChartColor;

  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <AreaChart
      className={className}
      width={700}
      height={350}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
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
      <YAxis axisLine={false} tickLine={false} stroke={styles.accessoryColor} domain={[0, 50]} />
      <Tooltip isAnimationActive={false} cursor={styles.cursor} />
      <Area
        dataKey="uv"
        stroke={chartColor}
        strokeWidth="2px"
        fillOpacity={1}
        fill={`url(#${gradientId})`}
        activeDot={styles.activeDot}
      />
    </AreaChart>
  );
};
