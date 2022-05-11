/** @jsxImportSource @emotion/react */
import React from 'react';
import Paper from '@mui/material/Paper';

import { useStyles } from './styles';

export interface ICardProps {
  title: string;
}

const Card: React.FC<ICardProps> = ({ children, title }) => {
  const styles = useStyles();

  return (
    <Paper>
      <h4 css={styles.title}>{title}</h4>

      {children}
    </Paper>
  );
};

export default Card;
