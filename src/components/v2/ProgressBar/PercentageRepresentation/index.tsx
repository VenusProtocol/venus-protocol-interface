/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { formatToReadablePercentage } from 'utilities/common';
import { IProgressBarProps, ProgressBar } from '..';
import { useStyles } from './styles';

export const PercentageRepresentation: React.FC<Pick<IProgressBarProps, 'value' | 'className'>> = ({
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
