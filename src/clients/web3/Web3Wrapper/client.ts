import config from 'config';
import { ChainId } from 'packages/contracts';
import { Chain, configureChains, createClient } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { WALLET_CONNECT_PROJECT_ID } from 'constants/walletConnect';

import { BinanceWalletConnector } from './binanceWalletConnector';

export const chains: Chain[] = config.isOnTestnet ? [bscTestnet] : [bsc];

export const { provider, webSocketProvider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: chain => config.rpcUrls[chain.id as ChainId],
    }),
    publicProvider(),
  ],
);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new InjectedConnector({ chains }),
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Venus',
      },
    }),
    new BinanceWalletConnector({
      chains,
    }),
  ],
  webSocketProvider,
});

export default client;
