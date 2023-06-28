/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';

import useProgressColor from 'hooks/useProgressColor';

import { useStyles } from './styles';

export interface ProgressCircleProps {
  value: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ value }) => {
  const styles = useStyles();
  const progressColor = useProgressColor(value);

  const { radius, circumference, offset } = useMemo(() => {
    const tmpRadius = 6;
    const tmpCircumference = 2 * Math.PI * tmpRadius;
    const tmpOffset = -1 * ((100 - value) / 100) * tmpCircumference;

    return {
      radius: tmpRadius,
      circumference: tmpCircumference,
      offset: tmpOffset,
    };
  }, [value]);

  return (
    <svg viewBox="0 0 16px 16px" css={styles.container}>
      <circle fill="transparent" r={radius} cx="8" cy="8" css={styles.circleBackground} />

      <circle
        css={styles.getCircle({ circumference, offset })}
        stroke={progressColor}
        fill="transparent"
        r={radius}
        cx="8"
        cy="8"
      />
    </svg>
  );
};
