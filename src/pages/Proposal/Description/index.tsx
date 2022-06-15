/** @jsxImportSource @emotion/react */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Paper } from '@mui/material';

import Typography from '@mui/material/Typography';
import { useStyles } from './styles';

interface IDescriptionSummary {
  className?: string;
  descriptionMarkdown: string;
}

export const Description: React.FC<IDescriptionSummary> = ({ className, descriptionMarkdown }) => {
  const styles = useStyles();
  return (
    <Paper css={styles.root} className={className}>
      <Typography variant="h4" color="textSecondary">
        Description
      </Typography>
      <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
    </Paper>
  );
};

export default Description;
