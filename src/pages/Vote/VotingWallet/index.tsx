/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

export const VoteUi: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <Typography variant="h4">{t('vote.votingWallet')}</Typography>
    </div>
  );
};

const Vote: React.FC = () => <VoteUi />;

export default Vote;
