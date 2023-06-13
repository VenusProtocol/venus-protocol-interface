/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React from 'react';

import { InfoIcon } from '../InfoIcon';
import { useStyles } from './styles';

export interface Cell {
  label: string;
  value: string | number;
  tooltip?: string;
  color?: string;
}

export interface CellGroupProps {
  cells: Cell[];
  smallValues?: boolean;
  className?: string;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  smallValues = false,
  ...containerProps
}) => {
  const styles = useStyles();

  return (
    <Paper css={styles.container} {...containerProps}>
      {cells.map(({ label, value, tooltip, color }) => (
        <div css={styles.cell} key={`cell-group-item-${label}`}>
          <div css={styles.labelContainer}>
            <Typography variant={smallValues ? 'small2' : 'body2'} css={styles.label}>
              {label}
            </Typography>

            {!!tooltip && <InfoIcon tooltip={tooltip} css={styles.labelInfoIcon} />}
          </div>

          <Typography variant={smallValues ? 'h4' : 'h3'} css={styles.getValue({ color })}>
            {value}
          </Typography>
        </div>
      ))}
    </Paper>
  );
};

export default CellGroup;
