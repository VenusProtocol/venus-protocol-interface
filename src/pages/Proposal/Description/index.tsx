/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import { useStyles } from './styles';

interface IDescriptionSummary {
  className?: string;
}

export const Description: React.FC<IDescriptionSummary> = ({ className }) => {
  const styles = useStyles();
  return <Paper css={styles.root} className={className} />;
};

export default Description;
