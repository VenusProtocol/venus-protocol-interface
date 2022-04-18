/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { getBigNumber, formatCentsToReadableValue } from 'utilities/common';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface IValueUpdateProps {
  className?: string;
  original: number | BigNumber;
  update: number | BigNumber | undefined;
  /** Defaults to formating cents to readable dollar value */
  format?: (value: { value: number | BigNumber }) => string;
}

export const ValueUpdate: React.FC<IValueUpdateProps> = ({
  className,
  original,
  update,
  format = formatCentsToReadableValue,
}) => {
  const updateIsValid = typeof update === 'number' || update instanceof BigNumber;
  const originalBigNumber = getBigNumber(original);
  const updateBigNumber = getBigNumber(update);
  const increase = !!(updateIsValid && updateBigNumber.isGreaterThanOrEqualTo(originalBigNumber));
  const styles = useStyles({ increase });
  return (
    <div className={className} css={styles.container}>
      <Typography component="span" variant="body1">
        {format({ value: original })}
      </Typography>
      {updateIsValid && (
        <>
          <Icon name="arrowShaft" css={styles.icon} />
          <Typography component="span" variant="body1">
            {format({ value: update })}
          </Typography>
        </>
      )}
    </div>
  );
};
