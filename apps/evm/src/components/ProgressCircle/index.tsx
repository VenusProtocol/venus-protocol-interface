import { useMemo } from 'react';

import { useTheme } from '@mui/material';

export interface ProgressCircleProps extends React.HTMLAttributes<SVGElement> {
  value: number;
  size?: 'sm' | 'md';
  fillColor?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  fillColor,
  size = 'md',
  ...otherProps
}) => {
  const theme = useTheme();

  const strokeWidthPx = size === 'sm' ? 2 : 4;
  const sizePx = size === 'sm' ? 16 : 40;

  const { radius, circumference, offset } = useMemo(() => {
    const radius = Math.min(sizePx, sizePx) / 2 - strokeWidthPx;
    const tmpRadius = size === 'sm' ? 6 : 18;
    const tmpCircumference = 2 * Math.PI * radius;
    const tmpOffset = -1 * ((100 - value) / 100) * tmpCircumference;

    return {
      radius: tmpRadius,
      circumference: tmpCircumference,
      offset: tmpOffset,
    };
  }, [value, size, sizePx, strokeWidthPx]);

  return (
    <svg width={sizePx} height={sizePx} {...otherProps}>
      <circle
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={strokeWidthPx}
        fill="transparent"
        r={radius}
        cx={sizePx / 2}
        cy={sizePx / 2}
      />

      <circle
        className="-rotate-90 origin-[50%_50%]"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        stroke={fillColor || theme.palette.interactive.success}
        strokeWidth={strokeWidthPx}
        fill="transparent"
        r={radius}
        cx={sizePx / 2}
        cy={sizePx / 2}
      />
    </svg>
  );
};
