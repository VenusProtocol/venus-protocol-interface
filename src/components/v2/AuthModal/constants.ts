import { ReactComponent as MetaMaskLogo } from 'assets/img/v2/wallets/metaMaskLogo.svg';
import { ReactComponent as TrustWalletLogo } from 'assets/img/v2/wallets/trustWalletLogo.svg';
import { ReactComponent as WalletConnectLogo } from 'assets/img/v2/wallets/walletConnectLogo.svg';
import { ReactComponent as BinanceChainWalletLogo } from 'assets/img/v2/wallets/binanceChainWalletLogo.svg';
import { ReactComponent as LedgerLogo } from 'assets/img/v2/wallets/ledgerLogo.svg';
import { ReactComponent as SafePalLogo } from 'assets/img/v2/wallets/safePalLogo.svg';
import { ReactComponent as CoinbaseWalletLogo } from 'assets/img/v2/wallets/coinbaseWalletLogo.svg';
import { Connector } from 'clients/web3';
import { BaseWallet, Wallet } from './types';

export const WALLETS: Wallet[] = [
  {
    name: 'MetaMask',
    Logo: MetaMaskLogo,
    connector: Connector.MetaMask,
  },
  {
    name: 'Coinbase Wallet',
    Logo: CoinbaseWalletLogo,
    connector: Connector.CoinbaseWallet,
    mainnetOnly: true,
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
    mainnetOnly: true,
  },
  {
    name: 'Binance Chain Wallet',
    Logo: BinanceChainWalletLogo,
    connector: Connector.BinanceChainWallet,
  },
];

export const UPCOMING_WALLETS: BaseWallet[] = [
  {
    name: 'Ledger',
    Logo: LedgerLogo,
  },
  {
    name: 'SafePal',
    Logo: SafePalLogo,
  },
];
