/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import { useStyles } from './styles';

interface IVotesProps {
  className?: string;
}

export const Votes: React.FC<IVotesProps> = ({ className }) => {
  const styles = useStyles();
  return <Paper css={styles.root} className={className} />;
};

export default Votes;
