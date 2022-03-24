/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { Connector } from 'clients/web3';
import { WALLETS } from '../constants';
import { Icon } from '../../Icon';
import { useStyles } from './styles';

export interface IAccountDetailsProps {
  onLogOut: () => void;
  onCopyAccountAddress: (accountAddress: string) => void;
  account: {
    address: string;
    connector: Connector;
  };
}

export const AccountDetails: React.FC<IAccountDetailsProps> = ({
  onLogOut,
  onCopyAccountAddress,
  account,
}) => {
  const styles = useStyles();

  // Grab the wallet info. Note that we default to the first wallet in the list
  // if no match is found, but in reality that case should never happen
  const { Logo: WalletLogo, name: walletName } =
    WALLETS.find(wallet => wallet.connector === account.connector) || WALLETS[0];

  return (
    <div css={styles.container}>
      <div css={styles.infoContainer}>
        <WalletLogo css={styles.walletLogo} />

        <div css={styles.infoRightColumn}>
          <Typography component="span" css={styles.walletName}>
            {walletName}
          </Typography>

          <div css={styles.accountAddressContainer}>
            <Typography component="span" css={styles.accountAddress}>
              {account.address}
            </Typography>

            <button
              onClick={() => onCopyAccountAddress(account.address)}
              type="button"
              css={styles.copyButton}
            >
              <Icon
                name="copy"
                color={styles.theme.palette.interactive.primary}
                size={styles.theme.spacing(3)}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
