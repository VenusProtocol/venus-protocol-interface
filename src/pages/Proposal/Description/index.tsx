/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Markdown from 'components/v2/Markdown/Viewer';
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
      <Markdown css={styles.markdown} content={descriptionMarkdown} />
    </Paper>
  );
};

export default Description;
