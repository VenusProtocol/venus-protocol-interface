import { theme } from '@venusprotocol/ui';

export interface ChartYAxisTickProps {
  value: string | number;
  y: number;
}

export const ChartYAxisTick: React.FC<ChartYAxisTickProps> = ({ value, y }) => (
  <g transform={`translate(${0},${y})`}>
    <text x={0} y={0} textAnchor="start" fill={theme.colors.grey}>
      {value}
    </text>
  </g>
);
