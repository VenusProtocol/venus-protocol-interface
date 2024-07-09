import { t } from 'libs/translations';
import { isRunningInOperaBrowser } from 'utilities/walletDetection';
import binanceWalletLogoSrc from './img/wallets/binanceWallet.svg';
import bitGetWalletLogoSrc from './img/wallets/bitgetWallet.png';
import braveWalletLogoSrc from './img/wallets/braveWallet.svg';
import coinbaseWalletLogoSrc from './img/wallets/coinbaseWallet.svg';
import gateWalletLogoSrc from './img/wallets/gateWallet.svg';
import infinityWalletLogoSrc from './img/wallets/infinityWallet.svg';
import ledgerLogoSrc from './img/wallets/ledger.svg';
import metaMaskLogoSrc from './img/wallets/metaMask.svg';
import okxWalletLogoSrc from './img/wallets/okxWallet.svg';
import operaWalletLogoSrc from './img/wallets/operaWallet.svg';
import rabbyLogoSrc from './img/wallets/rabby.svg';
import safePalLogoSrc from './img/wallets/safePal.svg';
import trustWalletLogoSrc from './img/wallets/trustWallet.svg';
import walletConnectLogoSrc from './img/wallets/walletConnect.svg';

import type { BaseWallet, IntegratedWallet, Wallet } from './types';

export const wallets: Wallet[] = [
  {
    name: t('wallets.binanceWallet'),
    logoSrc: binanceWalletLogoSrc,
    connectorId: 'BinanceW3WSDK',
    mainnetOnly: true,
  },
  {
    name: t('wallets.trustWallet'),
    logoSrc: trustWalletLogoSrc,
    connectorId: 'injected',
  },
  {
    name: t('wallets.metamask'),
    logoSrc: metaMaskLogoSrc,
    connectorId: 'io.metamask',
  },
  {
    name: t('wallets.coinbaseWallet'),
    logoSrc: coinbaseWalletLogoSrc,
    connectorId: 'coinbaseWalletSDK',
  },
  {
    name: t('wallets.walletConnect'),
    logoSrc: walletConnectLogoSrc,
    connectorId: 'walletConnect',
  },
  {
    name: t('wallets.safePal'),
    logoSrc: safePalLogoSrc,
    connectorId: 'injected',
  },
  {
    name: t('wallets.okxWallet'),
    logoSrc: okxWalletLogoSrc,
    connectorId: 'com.okex.wallet',
  },
  {
    name: t('wallets.braveWallet'),
    logoSrc: braveWalletLogoSrc,
    connectorId: 'com.brave.wallet',
  },
  {
    name: t('wallets.infinityWallet'),
    logoSrc: infinityWalletLogoSrc,
    connectorId: 'io.infinitywallet',
  },
  {
    name: t('wallets.bitget'),
    logoSrc: bitGetWalletLogoSrc,
    connectorId: 'com.bitget.web3',
    mainnetOnly: true,
  },
  {
    name: t('wallets.rabbyWallet'),
    logoSrc: rabbyLogoSrc,
    connectorId: 'io.rabby',
  },
  {
    name: t('wallets.gateWallet'),
    logoSrc: gateWalletLogoSrc,
    connectorId: 'io.gate.wallet',
    mainnetOnly: true,
  },
];

// Add Opera Wallet to the top of the list if dApp is running in Opera
if (isRunningInOperaBrowser()) {
  wallets.unshift({
    name: t('wallets.opera'),
    logoSrc: operaWalletLogoSrc,
    connectorId: 'injected',
    mainnetOnly: true,
  });
}

export const integratedWallets: IntegratedWallet[] = [
  {
    name: t('wallets.ledger'),
    logoSrc: ledgerLogoSrc,
    linkUrl: 'https://www.ledger.com/academy/security/the-safest-way-to-use-metamask',
  },
];

export const upcomingWallets: BaseWallet[] = [];
