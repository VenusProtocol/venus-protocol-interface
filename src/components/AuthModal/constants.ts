import { t } from 'translation';

import { ReactComponent as BinanceChainWalletLogo } from 'assets/img/wallets/binanceChainWalletLogo.svg';
import { ReactComponent as BitKeepLogo } from 'assets/img/wallets/bitKeepLogo.svg';
import { ReactComponent as BraveWalletLogo } from 'assets/img/wallets/braveWalletLogo.svg';
import { ReactComponent as CoinbaseWalletLogo } from 'assets/img/wallets/coinbaseWalletLogo.svg';
import { ReactComponent as InfinityWalletLogo } from 'assets/img/wallets/infinityWalletLogo.svg';
import { ReactComponent as LedgerLogo } from 'assets/img/wallets/ledgerLogo.svg';
import { ReactComponent as MetaMaskLogo } from 'assets/img/wallets/metaMaskLogo.svg';
import { ReactComponent as OkxWalletLogo } from 'assets/img/wallets/okxLogo.svg';
import { ReactComponent as OperaWalletLogo } from 'assets/img/wallets/operaWalletLogo.svg';
import { ReactComponent as SafePalLogo } from 'assets/img/wallets/safePalWalletLogo.svg';
import { ReactComponent as TrustWalletLogo } from 'assets/img/wallets/trustWalletLogo.svg';
import { ReactComponent as WalletConnectLogo } from 'assets/img/wallets/walletConnectLogo.svg';
import { Connector } from 'clients/web3/types';
import { isRunningInOperaBrowser } from 'utilities/walletDetection';

import { BaseWallet, IntegratedWallet, Wallet } from './types';

export const VENUS_TERMS_OF_SERVICE_URL = 'https://www.swipe.io/terms';

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
  },
  {
    name: t('wallets.safePal'),
    Logo: SafePalLogo,
    connector: Connector.SafePal,
  },
  {
    name: t('wallets.okxWallet'),
    Logo: OkxWalletLogo,
    connector: Connector.OkxWallet,
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
  {
    name: t('wallets.bitKeep'),
    Logo: BitKeepLogo,
    connector: Connector.BitKeep,
    mainnetOnly: true,
  },
];

// Add Opera Wallet to the top of the list if dApp is running in Opera
if (isRunningInOperaBrowser()) {
  WALLETS.unshift({
    name: t('wallets.opera'),
    Logo: OperaWalletLogo,
    connector: Connector.OperaWallet,
    mainnetOnly: true,
  });
}

export const INTEGRATED_WALLETS: IntegratedWallet[] = [
  {
    name: t('wallets.ledger'),
    Logo: LedgerLogo,
    linkUrl: 'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask',
  },
];

export const UPCOMING_WALLETS: BaseWallet[] = [];
