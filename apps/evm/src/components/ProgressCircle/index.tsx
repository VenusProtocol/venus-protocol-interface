import { useMemo } from 'react';

import { useTheme } from '@mui/material';
import { cn } from 'utilities';

export interface ProgressCircleProps extends React.HTMLAttributes<SVGElement> {
  value: number;
  size?: 'sm' | 'md';
  fillColor?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  fillColor,
  size = 'md',
  className,
  ...otherProps
}) => {
  const theme = useTheme();

  const strokeWidthPx = size === 'sm' ? 3 : 6;
  const sizePx = size === 'sm' ? 16 : 50;

  const { circumference, offset } = useMemo(() => {
    const radius = sizePx / 2;
    const tmpRadius = size === 'sm' ? 6 : 18;
    const tmpCircumference = 2 * Math.PI * radius;
    const tmpOffset = tmpCircumference * ((100 - value) / 100);

    return {
      radius: tmpRadius,
      circumference: tmpCircumference,
      offset: tmpOffset,
    };
  }, [value, size, sizePx]);

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox={`-${sizePx * 0.125} -${sizePx * 0.125} ${sizePx * 1.25} ${sizePx * 1.25}`}
      className={cn('rotate-90 scale-x-[-1]', className)}
      {...otherProps}
    >
      <circle
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={strokeWidthPx}
        fill="transparent"
        r={sizePx / 2}
        cx={sizePx / 2}
        cy={sizePx / 2}
      />

      <circle
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        stroke={fillColor || theme.palette.interactive.success}
        strokeWidth={strokeWidthPx}
        fill="transparent"
        r={sizePx / 2}
        cx={sizePx / 2}
        cy={sizePx / 2}
      />
    </svg>
  );
};
