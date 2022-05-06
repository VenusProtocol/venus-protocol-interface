/** @jsxImportSource @emotion/react */
import React from 'react';

import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { NoticeInfo } from '../Notice';
import { SecondaryButton } from '../Button';
import { useStyles } from './styles';

export interface IPromptProps {
  message: string;
  openAuthModal: () => void;
  className?: string;
  connected: boolean;
}

export const Prompt: React.FC<IPromptProps> = ({
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
    <div className={className}>
      <NoticeInfo css={styles.notice} description={message} />

      <SecondaryButton fullWidth onClick={openAuthModal}>
        {t('connectWallet.connectButton')}
      </SecondaryButton>
    </div>
  );
};

export const ConnectWallet: React.FC<Omit<IPromptProps, 'connected' | 'openAuthModal'>> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return <Prompt {...props} openAuthModal={openAuthModal} connected={!!account} />;
};
