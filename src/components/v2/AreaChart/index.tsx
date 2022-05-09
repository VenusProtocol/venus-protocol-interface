/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Tooltip,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { useUID } from 'react-uid';

export interface IAreaChartProps {
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

export const AreaChart: React.FC<IAreaChartProps> = ({ className }) => {
  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <div className={className}>
      <RechartsAreaChart
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
        {/* Gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8884d8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#383944" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9597A1" />
        {/* TODO: set domain based on data (with 100 being the minimum) */}
        <YAxis axisLine={false} tickLine={false} stroke="#9597A1" domain={[0, 50]} />
        <Tooltip />
        <Area
          dataKey="uv"
          stroke="#8884d8"
          strokeWidth="2px"
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </RechartsAreaChart>
    </div>
  );
};
