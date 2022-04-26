/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { getBigNumber, formatCentsToReadableValue } from 'utilities/common';
import { Icon } from '../Icon';
import { useStyles } from './styles';

type NumberValueProps = {
  original: number | undefined;
  update: number | undefined;
  format?: (value: number | undefined) => string;
};

type BigNumberValueProps = {
  original: BigNumber | undefined;
  update: BigNumber | undefined;
  format?: (value: BigNumber | undefined) => string;
};

export type ValueUpdateProps = {
  className?: string;
} & (NumberValueProps | BigNumberValueProps);

export const ValueUpdate: React.FC<ValueUpdateProps> = ({
  className,
  original,
  update,
  format = (value: ValueUpdateProps['original']) => formatCentsToReadableValue({ value }),
}) => {
  const updateIsValid = typeof update === 'number' || update instanceof BigNumber;
  const originalBigNumber = getBigNumber(original);
  const updateBigNumber = getBigNumber(update);
  const increase = !!(updateIsValid && updateBigNumber.isGreaterThanOrEqualTo(originalBigNumber));
  const styles = useStyles({ increase });

  return (
    <div className={className} css={styles.container}>
      <Typography component="span" variant="body1">
        {format(original as never)}
      </Typography>
      {updateIsValid && (
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
