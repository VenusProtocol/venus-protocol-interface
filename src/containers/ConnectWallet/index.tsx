/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'packages/translations';
import { useAccountAddress, useAuthModal } from 'packages/wallet';

import { SecondaryButton } from '../../components/Button';
import { NoticeInfo } from '../../components/Notice';
import { useStyles } from './styles';

export interface PromptProps {
  message: string;
  openAuthModal: () => void;
  connected: boolean;
  className?: string;
  children?: React.ReactNode;
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

      <SecondaryButton className="w-full" onClick={openAuthModal}>
        {t('connectWallet.connectButton')}
      </SecondaryButton>
    </div>
  );
};

export const ConnectWallet: React.FC<Omit<PromptProps, 'connected' | 'openAuthModal'>> = props => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  return <Prompt {...props} openAuthModal={openAuthModal} connected={!!accountAddress} />;
};
