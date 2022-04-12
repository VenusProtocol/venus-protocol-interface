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
  // Render prompt if user aren't connected with any wallet
  if (connected) {
    return <>{children}</>;
  }
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

export const ConnectWallet: React.FC<Omit<IPromptProps, 'connected' | 'openAuthModal'>> = props => {
  const { account, openAuthModal } = React.useContext(AuthContext);
  return <Prompt {...props} openAuthModal={openAuthModal} connected={!!account} />;
};
