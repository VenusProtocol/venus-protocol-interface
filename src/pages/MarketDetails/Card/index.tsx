/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { useStyles } from './styles';

export interface ILegend {
  label: string;
  color: string;
}

export interface ICardProps {
  title: string;
  legends?: ILegend[];
}

const Card: React.FC<ICardProps> = ({ children, title, legends = [] }) => {
  const styles = useStyles();

  return (
    <Paper>
      <div css={styles.header}>
        <h4 css={styles.title}>{title}</h4>

        {legends.length > 0 && (
          <div css={styles.legendsContainer}>
            {legends.map(legend => (
              <div css={styles.legend}>
                <div css={styles.getLegendColorIndicator({ color: legend.color })} />

                <Typography css={styles.legendLabel} variant="small2">
                  {legend.label}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>

      {children}
    </Paper>
  );
};

export default Card;
