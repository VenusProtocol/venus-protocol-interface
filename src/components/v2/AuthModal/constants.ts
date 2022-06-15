import { ReactComponent as MetaMaskLogo } from 'assets/img/v2/wallets/metaMaskLogo.svg';
import { ReactComponent as TrustWalletLogo } from 'assets/img/v2/wallets/trustWalletLogo.svg';
import { ReactComponent as WalletConnectLogo } from 'assets/img/v2/wallets/walletConnectLogo.svg';
import { ReactComponent as BinanceChainWalletLogo } from 'assets/img/v2/wallets/binanceChainWalletLogo.svg';
import { ReactComponent as LedgerLogo } from 'assets/img/v2/wallets/ledgerLogo.svg';
import { ReactComponent as SafePalLogo } from 'assets/img/v2/wallets/safePalLogo.svg';
import { ReactComponent as CoinbaseWalletLogo } from 'assets/img/v2/wallets/coinbaseWalletLogo.svg';
import { ReactComponent as BraveWalletLogo } from 'assets/img/v2/wallets/braveWalletLogo.svg';
import { ReactComponent as InfinityWalletLogo } from 'assets/img/v2/wallets/infinityWalletLogo.svg';
import { t } from 'translation';
import { Connector } from 'clients/web3';
import { BaseWallet, Wallet, IntegratedWallet } from './types';

export const WALLETS: Wallet[] = [
  {
    name: t('wallets.metamask'),
    Logo: MetaMaskLogo,
    connector: Connector.MetaMask,
  },
  {
    name: t('wallets.coinbaseWallet'),
    Logo: CoinbaseWalletLogo,
    connector: Connector.CoinbaseWallet,
    mainnetOnly: true,
  },
  {
    name: t('wallets.trustWallet'),
    Logo: TrustWalletLogo,
    connector: Connector.TrustWallet,
  },
  {
    name: t('wallets.walletConnect'),
    Logo: WalletConnectLogo,
    connector: Connector.WalletConnect,
    mainnetOnly: true,
  },
  {
    name: t('wallets.binanceChainWallet'),
    Logo: BinanceChainWalletLogo,
    connector: Connector.BinanceChainWallet,
  },
  {
    name: t('wallets.braveWallet'),
    Logo: BraveWalletLogo,
    connector: Connector.BraveWallet,
  },
  {
    name: t('wallets.infinityWallet'),
    Logo: InfinityWalletLogo,
    connector: Connector.InfinityWallet,
    mainnetOnly: true,
  },
];

export const INTEGRATED_WALLETS: IntegratedWallet[] = [
  {
    name: t('wallets.ledger'),
    Logo: LedgerLogo,
    linkUrl: 'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask',
  },
];

export const UPCOMING_WALLETS: BaseWallet[] = [
  {
    name: 'SafePal',
    Logo: SafePalLogo,
  },
];
