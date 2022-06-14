/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import { useStyles } from './styles';

interface IProposalSummary {
  className?: string;
}

export const ProposalSummary: React.FC<IProposalSummary> = ({ className }) => {
  const styles = useStyles();
  return <Paper css={styles.root} className={className} />;
};

export default ProposalSummary;
