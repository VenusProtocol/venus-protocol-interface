/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { Connector } from 'clients/web3';
import { truncateAddress } from 'utilities/truncateAddress';
import { BscLink } from '../../BscLink';
import { Icon } from '../../Icon';
import { SecondaryButton } from '../../Button';
import { WALLETS } from '../constants';
import { useStyles } from './styles';

export interface IAccountDetailsProps {
  onLogOut: () => void;
  onCopyAccountAddress: (accountAddress: string) => void;
  account: {
    address: string;
    connector?: Connector;
  };
}

export const AccountDetails: React.FC<IAccountDetailsProps> = ({
  onLogOut,
  onCopyAccountAddress,
  account,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const truncatedAccountAddress = truncateAddress(account.address);

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

            {/* Only displayed on mobile */}
            <Typography component="span" css={styles.accountAddressMobile}>
              {truncatedAccountAddress}
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
