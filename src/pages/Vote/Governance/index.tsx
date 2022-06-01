/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

export const GovernanceUi: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  return (
    <div css={styles.root}>
      <Typography variant="h4">{t('vote.governanceProposals')}</Typography>
    </div>
  );
};

const Governance: React.FC = () => <GovernanceUi />;

export default Governance;
