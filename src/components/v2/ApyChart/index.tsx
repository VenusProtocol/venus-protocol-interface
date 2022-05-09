/** @jsxImportSource @emotion/react */
import React from 'react';
import { AreaChart, Tooltip, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useUID } from 'react-uid';

export interface IApyChartProps {
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
// TODO: get colors from theme

export const ApyChart: React.FC<IApyChartProps> = ({ className }) => {
  // Generate base ID that won't change between renders but will be incremented
  // automatically every time it is used (so multiple charts can be rendered
  // using unique ids)
  const baseId = useUID();
  const gradientId = `gradient-${baseId}`;

  return (
    <div className={className}>
      <AreaChart
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
            <stop offset="0%" stopColor="#8884d8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#383944" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9597A1" />
        {/* TODO: set domain based on data (with maximum starting at 100) */}
        <YAxis axisLine={false} tickLine={false} stroke="#9597A1" domain={[0, 50]} />
        <Tooltip isAnimationActive={false} cursor={{ strokeDasharray: '4 4', stroke: '#9597A1' }} />
        <Area
          dataKey="uv"
          stroke="#8884d8"
          strokeWidth="2px"
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </div>
  );
};
