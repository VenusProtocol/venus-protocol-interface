/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';

import { useAuth } from 'context/AuthContext';

import { SecondaryButton } from '../Button';
import { NoticeInfo } from '../Notice';
import { useStyles } from './styles';

export interface PromptProps {
  message: string;
  openAuthModal: () => void;
  className?: string;
  connected: boolean;
}

export const Prompt: React.FC<PromptProps> = ({
  message,
  openAuthModal,
  className,
  children,
  connected,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  // Render prompt if user aren't connected with any wallet
  if (connected) {
    return <>{children}</>;
  }
  return (
    <div css={styles.container} className={className}>
      <NoticeInfo css={styles.notice} description={message} />

      <SecondaryButton fullWidth onClick={openAuthModal}>
        {t('connectWallet.connectButton')}
      </SecondaryButton>
    </div>
  );
};

export const ConnectWallet: React.FC<Omit<PromptProps, 'connected' | 'openAuthModal'>> = props => {
  const { accountAddress, openAuthModal } = useAuth();
  return <Prompt {...props} openAuthModal={openAuthModal} connected={!!accountAddress} />;
};
