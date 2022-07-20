/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';

import { useStyles } from './styles';

export interface LayeredValuesProps {
  topValue: string | number;
  bottomValue: string | number;
  className?: string;
}

export const LayeredValues: React.FC<LayeredValuesProps> = ({
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
