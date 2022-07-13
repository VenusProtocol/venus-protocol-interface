/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { ReadableActionSignature, MarkdownViewer } from 'components';
import { useTranslation } from 'translation';
import { FormValues } from '../proposalSchema';
import { useStyles } from './styles';

const ProposalPreview: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  const {
    values: { title, description, actions, forDescription, abstainDescription, againstDescription },
  } = useFormikContext<FormValues>();

  return (
    <div css={styles.root}>
      <div css={styles.section}>
        <Typography variant="small1" css={styles.header}>
          {t('vote.createProposalForm.proposalName')}
        </Typography>

        <Typography variant="body1" color="textPrimary">
          {title}
        </Typography>
      </div>

      <div css={styles.section}>
        <Typography variant="small1" css={styles.header}>
          {t('vote.createProposalForm.description')}
        </Typography>

        <Typography variant="body1" color="textPrimary" component="span">
          <MarkdownViewer css={styles.markdown} content={description} />
        </Typography>
      </div>

      <div css={styles.section}>
        <Typography variant="small1" css={styles.header}>
          {t('vote.createProposalForm.votingOptions')}
        </Typography>

        <ul css={styles.ul}>
          <li>
            <Typography variant="body1" color="textPrimary">
              {t('vote.for')} - {forDescription}
            </Typography>
          </li>

          <li>
            <Typography variant="body1" color="textPrimary">
              {t('vote.against')} - {againstDescription}
            </Typography>
          </li>

          <li>
            <Typography variant="body1" color="textPrimary">
              {t('vote.abstain')} - {abstainDescription}
            </Typography>
          </li>
        </ul>
      </div>

      <div css={styles.section}>
        <Typography variant="small1" css={styles.header}>
          {t('vote.createProposalForm.actions')}
        </Typography>

        {actions.map(action => (
          <ReadableActionSignature action={action} />
        ))}
      </div>
    </div>
  );
};

export default ProposalPreview;
