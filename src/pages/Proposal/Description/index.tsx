/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Markdown from 'components/v2/Markdown/Viewer';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

interface IDescriptionSummary {
  className?: string;
  description: string;
}

export const Description: React.FC<IDescriptionSummary> = ({ className, description }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Paper css={styles.root} className={className}>
      <Typography variant="h4" color="textSecondary">
        {t('voteProposalUi.description')}
      </Typography>
      <Markdown css={styles.markdown} content={description} />
    </Paper>
  );
};

export default Description;
