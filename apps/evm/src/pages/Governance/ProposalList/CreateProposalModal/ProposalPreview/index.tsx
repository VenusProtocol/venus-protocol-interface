/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';

import { MarkdownViewer } from 'components';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import { useTranslation } from 'libs/translations';
import { ProposalType } from 'types';

import type { FormValues } from '../proposalSchema';
import { useStyles } from './styles';

const ProposalPreview: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  const {
    values: {
      title,
      description,
      actions,
      forDescription,
      abstainDescription,
      againstDescription,
      proposalType,
    },
  } = useFormikContext<FormValues>();

  return (
    <div css={styles.root}>
      <div css={styles.section}>
        <Typography variant="small1" css={styles.header}>
          {t('vote.createProposalForm.proposalType')}
        </Typography>

        <Typography variant="body1" color="textPrimary">
          {
            {
              [ProposalType.NORMAL]: t('vote.proposalType.normal'),
              [ProposalType.FAST_TRACK]: t('vote.proposalType.fastTrack'),
              [ProposalType.CRITICAL]: t('vote.proposalType.critical'),
            }[proposalType]
          }
        </Typography>
      </div>

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
          <ReadableActionSignature
            key={`proposal-preview-readable-action-signature-${action.signature}-${action.target}-${action.callData}`}
            action={action}
          />
        ))}
      </div>
    </div>
  );
};

export default ProposalPreview;
