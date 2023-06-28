import config from 'config';
import { Chain, configureChains, createClient } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

import { WALLET_CONNECT_PROJECT_ID } from 'constants/walletConnect';

import { BinanceWalletConnector } from './binanceWalletConnector';

const bscExplorer = {
  name: 'BscScan',
  url: config.isOnTestnet ? 'https://testnet.bscscan.com' : 'https://bscscan.com',
};

export const chain: Chain = {
  id: config.chainId,
  name: config.isOnTestnet ? 'BNB Smart Chain Testnet' : 'BNB Smart Chain',
  network: config.isOnTestnet ? 'bsc-testnet' : 'bsc',
  rpcUrls: {
    default: {
      http: [config.rpcUrl],
    },
    public: {
      http: [config.rpcUrl],
    },
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
};

export const { provider, webSocketProvider } = configureChains([chain], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new InjectedConnector({ chains: [chain] }),
    new MetaMaskConnector({ chains: [chain] }),
    new WalletConnectConnector({
      chains: [chain],
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      options: {
        appName: 'Venus',
      },
    }),
    new BinanceWalletConnector({
      chains: [chain],
    }),
  ],
  webSocketProvider,
});

export default client;
