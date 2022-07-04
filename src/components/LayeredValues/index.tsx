/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';

import { useStyles } from './styles';

export interface ILayeredValuesProps {
  topValue: string | number;
  bottomValue: string | number;
  className?: string;
}

export const LayeredValues: React.FC<ILayeredValuesProps> = ({
  topValue,
  bottomValue,
  className,
}) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      <Typography variant="small1" css={styles.topValue}>
        {topValue}
      </Typography>

      <Typography variant="small2">{bottomValue}</Typography>
    </div>
  );
};
export default LayeredValues;
