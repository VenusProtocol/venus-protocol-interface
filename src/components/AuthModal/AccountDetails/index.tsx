/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';

import { Connector } from 'clients/web3/types';

import { BscLink } from '../../BscLink';
import { SecondaryButton } from '../../Button';
import { EllipseAddress } from '../../EllipseAddress';
import { Icon } from '../../Icon';
import { WALLETS } from '../constants';
import { useStyles } from './styles';

export interface AccountDetailsProps {
  onLogOut: () => void;
  onCopyAccountAddress: (accountAddress: string) => void;
  account: {
    address: string;
    connector?: Connector;
  };
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  onLogOut,
  onCopyAccountAddress,
  account,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

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
              <EllipseAddress ellipseBreakpoint="md" address={account.address} />
            </Typography>

            <button
              onClick={() => onCopyAccountAddress(account.address)}
              type="button"
              css={styles.copyButton}
            >
              <Icon name="copy" css={styles.copyButtonIcon} />
            </button>
          </div>
        </div>
      </div>

      <BscLink css={styles.bscScanLinkContainer} hash={account.address} />

      <SecondaryButton onClick={onLogOut} fullWidth>
        {t('authModal.accountDetails.logOutButtonLabel')}
      </SecondaryButton>
    </div>
  );
};
