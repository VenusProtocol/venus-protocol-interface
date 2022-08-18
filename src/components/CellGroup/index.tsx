/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import React from 'react';

import { useStyles } from './styles';

export interface Cell {
  label: string;
  value: string | number;
  color?: string;
}

export interface NumberCellGroupProps {
  cells: Cell[];
  title?: string;
}

export const CellGroup: React.FC<NumberCellGroupProps> = ({ cells, title }) => {
  const styles = useStyles();

  return (
    <Paper css={styles.container}>
      {!!title && <h4 css={styles.title}>{title}</h4>}

      <div css={styles.cellContainer}>
        {cells.map(({ label, value }) => (
          <div css={styles.cell}>
            <Typography variant="body2" css={styles.label} component="div">
              {label}
            </Typography>

            <Typography variant="h3" css={styles.value}>
              {value}
            </Typography>
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default CellGroup;
