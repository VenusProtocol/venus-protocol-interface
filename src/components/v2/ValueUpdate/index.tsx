/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { formatCentsToReadableValue } from 'utilities/common';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface IValueUpdateProps {
  className?: string;
  original: number | BigNumber;
  update: number | BigNumber;
  /** Defaults to formating cents to readable dollar value */
  format?: (value: number | BigNumber) => string;
}

export const ValueUpdate: React.FC<IValueUpdateProps> = ({
  className,
  original,
  update,
  format = formatCentsToReadableValue,
}) => {
  const increase = update > original;
  const styles = useStyles({ increase });

  return (
    <div className={className} css={styles.container}>
      <Typography component="span" variant="body1">
        {format(original)}
      </Typography>
      <Icon name="arrowShaft" css={styles.icon} />
      <Typography component="span" variant="body1">
        {format(update)}
      </Typography>
    </div>
  );
};
