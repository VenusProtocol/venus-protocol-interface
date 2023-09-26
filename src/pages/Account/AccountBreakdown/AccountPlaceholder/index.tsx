/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { LinkButton } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { routes } from 'constants/routing';

import { useStyles } from './styles';
import wallet from './wallet.png';

const AccountPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.placeholderContainer}>
      <div>
        <img
          src={wallet}
          css={styles.wallet}
          alt={t('dashboard.connectWalletBanner.illustration.alt')}
        />
      </div>
      <Typography css={styles.placeholderText} variant="h4">
        {t('accountPlaceholder.assetsWillAppearHere')}
      </Typography>
      <LinkButton to={routes.dashboard.path}>{t('accountPlaceholder.letsGetStarted')}</LinkButton>
    </div>
  );
};

export default AccountPlaceholder;
