/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { formatToReadablePercentage } from 'utilities';

import { ProgressBar, ProgressBarProps } from '..';
import { useStyles } from './styles';

export const PercentageRepresentation: React.FC<Pick<ProgressBarProps, 'value' | 'className'>> = ({
  value,
  className,
}) => {
  const styles = useStyles();
  return (
    <div css={styles.root}>
      <ProgressBar
        className={className}
        value={value}
        mark={undefined}
        step={1}
        ariaLabel="percentage"
        min={0}
        max={100}
      />
      <Typography component="span" variant="small1" color="text.primary" css={styles.percentage}>
        {formatToReadablePercentage(value)}
      </Typography>
    </div>
  );
};
