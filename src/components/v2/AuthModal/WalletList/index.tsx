/** @jsxImportSource @emotion/react */
import React from 'react';

import { ReactComponent as MetaMaskLogo } from 'assets/img/v2/wallets/metaMaskLogo.svg';
import { ReactComponent as TrustWalletLogo } from 'assets/img/v2/wallets/trustWalletLogo.svg';
import { ReactComponent as WalletConnectLogo } from 'assets/img/v2/wallets/walletConnectLogo.svg';
import { ReactComponent as BinanceChainWalletLogo } from 'assets/img/v2/wallets/binanceChainWalletLogo.svg';
import { ReactComponent as LedgerLogo } from 'assets/img/v2/wallets/ledgerLogo.svg';
import { ReactComponent as SafePalLogo } from 'assets/img/v2/wallets/safePalLogo.svg';
import { Connector } from 'clients/web3';
import Typography from '@mui/material/Typography';
import { Icon } from '../../Icon';

import { useStyles } from './styles';

type BaseWallet = {
  name: string;
  Logo: React.FC<React.SVGProps<SVGSVGElement>>;
};

type Wallet = BaseWallet & {
  connector: Connector;
};

const wallets: Wallet[] = [
  {
    name: 'MetaMask',
    Logo: MetaMaskLogo,
    connector: Connector.MetaMask,
  },
  {
    name: 'Trust Wallet',
    Logo: TrustWalletLogo,
    connector: Connector.TrustWallet,
  },
  {
    name: 'WalletConnect',
    Logo: WalletConnectLogo,
    connector: Connector.WalletConnect,
  },
  {
    name: 'Binance Chain Wallet',
    Logo: BinanceChainWalletLogo,
    connector: Connector.BinanceChainWallet,
  },
];

const upcomingWallets: BaseWallet[] = [
  {
    name: 'Ledger',
    Logo: LedgerLogo,
  },
  {
    name: 'SafePal',
    Logo: SafePalLogo,
  },
];

export interface IWalletListProps {
  onLogin: (connector: Connector) => void;
}

export const WalletList: React.FC<IWalletListProps> = ({ onLogin }) => {
  const styles = useStyles();

  return (
    <>
      {wallets.map(({ name, connector, Logo }) => (
        <button
          css={styles.getListItem({ isActionable: true })}
          key={`wallet-${name}`}
          type="button"
          onClick={() => onLogin(connector)}
        >
          <Logo css={styles.walletLogo} />

          <Typography css={styles.walletName} component="span">
            {name}
          </Typography>

          <Icon name="chevronRight" size="24px" color={styles.theme.palette.text.primary} />
        </button>
      ))}

      <div css={styles.divider} />

      {upcomingWallets.map(({ name, Logo }) => (
        <div css={styles.getListItem({ isActionable: false })} key={`upcoming-wallet-${name}`}>
          <Logo css={styles.walletLogo} />

          <Typography css={styles.walletName} component="span">
            {name}
          </Typography>

          <Typography css={styles.comingSoonText} component="span">
            Coming soon...
          </Typography>
        </div>
      ))}
    </>
  );
};
