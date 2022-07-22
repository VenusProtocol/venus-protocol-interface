/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { MarkdownViewer, ReadableActionSignature } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { DescriptionV1, DescriptionV2, ProposalAction } from 'types';

import { useStyles } from './styles';

interface DescriptionSummary {
  className?: string;
  description: DescriptionV1 | DescriptionV2;
  actions: ProposalAction[];
}

export const Description: React.FC<DescriptionSummary> = ({ className, description, actions }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Paper css={styles.root} className={className}>
      <div css={styles.content}>
        <Typography variant="h4" color="textSecondary">
          {t('voteProposalUi.description')}
        </Typography>

        <MarkdownViewer css={styles.markdown} content={description.description} />

        {description.version === 'v2' && (
          <>
            <Typography variant="h4" color="textSecondary" css={styles.section}>
              {t('voteProposalUi.votingOptions')}
            </Typography>

            <ul css={styles.votingOptionList}>
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

        {actions.map(action => (
          <ReadableActionSignature action={action} />
        ))}
      </div>
    </Paper>
  );
};

export default Description;
