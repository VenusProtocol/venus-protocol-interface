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
    <Paper css={styles.container}>
      <h4>{title}</h4>

      {children}
    </Paper>
  );
};

export default Card;
