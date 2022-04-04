/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { Icon } from '../Icon';
import { SecondaryButton } from '../Button';
import { useStyles } from './styles';

export interface IConnectWalletUiProps {
  message: IConnectWalletProps['message'];
}

// TODO: Move to dashboard component/container once created
export const ConnectWalletUi: React.FC<IConnectWalletUiProps> = ({ message }) => {
  const styles = useStyles();

  return (
    <div css={styles.container}>
      <div css={styles.messageContainer}>
        <Icon css={styles.icon} name="wallet" />

        <Typography variant="small2" component="span" css={styles.message}>
          {message}
        </Typography>
      </div>
    </div>
  );
};

export interface IConnectWalletProps {
  message: string;
}

export const ConnectWallet: React.FC<IConnectWalletProps> = ({ children, message }) => {
  // TODO: fetch actual data
  const isUserLoggedIn = false;

  // Render prompt message if user aren't connected with any wallet
  if (!isUserLoggedIn) {
    return <ConnectWalletUi message={message} />;
  }

  return <>{children}</>;
};
