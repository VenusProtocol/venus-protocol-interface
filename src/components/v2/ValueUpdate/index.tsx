/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { formatCentsToReadableValue } from 'utilities/common';
import { Icon } from '../Icon';
import { useStyles } from './styles';

interface INumberValueProps {
  original: number | undefined;
  update: number | undefined;
  format?: (value: number | undefined) => string;
}

interface IBigNumberValueProps {
  original: BigNumber | undefined;
  update: BigNumber | undefined;
  format?: (value: BigNumber | undefined) => string;
}

interface ValueUpdateCommonProps {
  className?: string;
  positiveDirection?: 'asc' | 'desc';
}

export type ValueUpdateProps = ValueUpdateCommonProps & (INumberValueProps | IBigNumberValueProps);

export const ValueUpdate: React.FC<ValueUpdateProps> = ({
  className,
  original,
  update,
  format = (value: ValueUpdateProps['original']) => formatCentsToReadableValue({ value }),
  positiveDirection = 'asc',
}) => {
  let isImprovement = false;
  if (typeof original === 'number' && typeof update === 'number') {
    isImprovement = positiveDirection === 'asc' ? update >= original : update <= original;
  } else if (original instanceof BigNumber && update instanceof BigNumber) {
    isImprovement =
      positiveDirection === 'asc'
        ? update.isGreaterThanOrEqualTo(original)
        : update.isLessThanOrEqualTo(original);
  }

  const styles = useStyles({ isImprovement });

  return (
    <div className={className} css={styles.container}>
      <Typography component="span" variant="body1">
        {format(original as never)}
      </Typography>

      {update !== undefined && (
        <>
          <Icon name="arrowShaft" css={styles.icon} />
          <Typography component="span" variant="body1">
            {format(update as never)}
          </Typography>
        </>
      )}
    </div>
  );
};
