import {
  type RainbowKitWalletConnectParameters,
  type Wallet,
  getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';

import logo from './logo.svg';

export const OATH_WALLET_ID = 'oath-wallet';
const APP_STORE_URL = 'https://apps.apple.com/app/id6780187283';

export const oathWallet = ({
  projectId,
  walletConnectParameters,
}: {
  projectId: string;
  walletConnectParameters?: RainbowKitWalletConnectParameters;
}): Wallet => ({
  id: OATH_WALLET_ID,
  name: 'Oath Wallet',
  iconUrl: logo,
  iconBackground: '#176BFF',
  downloadUrls: { ios: APP_STORE_URL, qrCode: APP_STORE_URL },
  hidden: () => typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent),
  mobile: { getUri: uri => `oathwallet://wc?uri=${encodeURIComponent(uri)}` },
  qrCode: {
    getUri: uri => uri,
    instructions: {
      learnMoreUrl: 'https://oathwallet.org',
      steps: [
        {
          step: 'install',
          title: 'Open Oath on your iPhone',
          description: 'Open Oath Wallet, or install it from the App Store.',
        },
        {
          step: 'scan',
          title: 'Scan the QR code',
          description: 'Use the QR scanner in Oath to scan this code.',
        },
        {
          step: 'connect',
          title: 'Review the connection',
          description:
            'Check the website and approve supported networks in Oath. Oath supports BNB Chain, Ethereum, Arbitrum and Base on Venus.',
        },
      ],
    },
  },
  createConnector: details => {
    const createConnector = getWalletConnectConnector({
      projectId,
      walletConnectParameters: {
        ...walletConnectParameters,
        // Keep Oath sessions separate from the generic WalletConnect entry.
        customStoragePrefix: 'venus-oath-wallet',
      },
    })(details);

    return config => ({
      ...createConnector(config),
      id: OATH_WALLET_ID,
      name: 'Oath Wallet',
    });
  },
});
