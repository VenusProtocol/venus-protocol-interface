/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { AuthContext } from 'context/AuthContext';
import { Icon } from '../Icon';
import { SecondaryButton } from '../Button';
import { useStyles } from './styles';

export interface IPromptProps {
  message: string;
  openAuthModal: () => void;
  className?: string;
}

export const Prompt: React.FC<IPromptProps> = ({ message, openAuthModal, className }) => {
  const styles = useStyles();

  return (
    <div className={className}>
      <div css={styles.prompt}>
        <Icon css={styles.icon} name="wallet" />

        <Typography variant="small2" component="span" css={styles.message}>
          {message}
        </Typography>
      </div>

      <SecondaryButton fullWidth onClick={openAuthModal}>
        Connect wallet
      </SecondaryButton>
    </div>
  );
};

export interface IConnectWalletProps {
  promptMessage: IPromptProps['message'];
}

export const ConnectWallet: React.FC<IConnectWalletProps> = ({ children, promptMessage }) => {
  const { account, openAuthModal } = React.useContext(AuthContext);

  // Render prompt if user aren't connected with any wallet
  if (!account) {
    return <Prompt message={promptMessage} openAuthModal={openAuthModal} />;
  }

  return <>{children}</>;
};
