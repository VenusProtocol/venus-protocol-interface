/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MarkdownViewer } from 'components';
import { useTranslation } from 'translation';
import { DescriptionV1, DescriptionV2, IProposalAction } from 'types';
import { useStyles } from './styles';

interface IDescriptionSummary {
  className?: string;
  description: DescriptionV1 | DescriptionV2;
  actions: IProposalAction[];
}

export const Description: React.FC<IDescriptionSummary> = ({ className, description, actions }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Paper css={styles.root} className={className}>
      <Typography variant="h4" color="textSecondary">
        {t('voteProposalUi.description')}
      </Typography>
      <MarkdownViewer css={styles.markdown} content={description.description} />
      {description.version === 'v2' && (
        <>
          <Typography variant="h4" color="textSecondary" css={styles.section}>
            {t('voteProposalUi.votingOptions')}
          </Typography>
          <ul>
            <li>
              {t('vote.for')} - {description.forDescription}
            </li>
            <li>
              {t('vote.against')} - {description.againstDescription}
            </li>
            <li>
              {t('vote.abstain')} - {description.abstainDescription}
            </li>
          </ul>
        </>
      )}
      <Typography variant="h4" color="textSecondary" css={styles.section}>
        {t('voteProposalUi.operation')}
      </Typography>
      {actions.map(({ title }) => (
        <MarkdownViewer key={title} css={[styles.markdown, styles.actionTitle]} content={title} />
      ))}
    </Paper>
  );
};

export default Description;
