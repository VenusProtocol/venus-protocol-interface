/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PrimaryButton } from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';

import { AuthContext } from 'context/AuthContext';

import illustration from './illustration.png';
import { useStyles } from './styles';

export interface ConnectWalletBannerUiProps {
  isWalletConnected: boolean;
  openAuthModal: () => void;
}

export const ConnectWalletBannerUi: React.FC<ConnectWalletBannerUiProps> = ({
  isWalletConnected,
  openAuthModal,
  ...containerProps
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isWalletConnected) {
    return null;
  }

  return (
    <Paper css={styles.container} {...containerProps}>
      <div css={styles.content}>
        <Typography variant="h2" css={styles.title}>
          {t('dashboard.connectWalletBanner.title')}
        </Typography>

        <Typography css={styles.description}>
          {t('dashboard.connectWalletBanner.description')}
        </Typography>

        <PrimaryButton css={styles.button} onClick={openAuthModal}>
          {t('dashboard.connectWalletBanner.buttonLabel')}
        </PrimaryButton>
      </div>

      <div css={styles.illustrationContainer}>
        <img src={illustration} css={styles.illustration} alt="" />
      </div>
    </Paper>
  );
};

const ConnectWalletBanner: React.FC = () => {
  const { account, openAuthModal } = useContext(AuthContext);

  return <ConnectWalletBannerUi isWalletConnected={!!account} openAuthModal={openAuthModal} />;
};

export default ConnectWalletBanner;
