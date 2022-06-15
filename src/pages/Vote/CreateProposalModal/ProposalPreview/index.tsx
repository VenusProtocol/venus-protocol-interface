/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { ethers } from 'ethers';
import { useFormikContext } from 'formik';
import { useTranslation } from 'translation';
import { FormValues } from '../proposalSchema';
import { useStyles } from './styles';

const formatSignature = (action: FormValues['actions'][number]) => {
  const fragment = ethers.utils.FunctionFragment.from(action.signature || '');
  return `${fragment.name}(${action.callData?.join(',')})`;
};

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
        <Typography variant="body1" color="textPrimary">
          {description}
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
          <React.Fragment key={action.signature}>
            <Typography css={styles.signature}>
              <Typography component="span">{t('vote.createProposalForm.unitroller')}</Typography>
              {formatSignature(action)}
            </Typography>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProposalPreview;
