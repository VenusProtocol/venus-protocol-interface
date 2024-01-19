import { getWagmiConnector as getBinanceW3WConnector } from '@binance/w3w-wagmi-connector';
import { configureChains, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import localConfig from 'config';
import { WALLET_CONNECT_PROJECT_ID } from 'constants/walletConnect';
import { chains } from 'packages/wallet/chains';
import { ChainId } from 'types';

const BinanceW3WConnector = getBinanceW3WConnector();

const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [
    jsonRpcProvider({
      rpc: chain => localConfig.rpcUrls[chain.id as ChainId],
    }),
  ],
  {
    stallTimeout: 3000, // Time after which a request is dimmed stalled and another provider is used
    batch: {
      multicall: false, // Disable wagmi's multicall feature as we wrap the provider with a 0xsequence multicall provider instead
    },
  },
);

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
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
    new BinanceW3WConnector({
      chains,
      // this avoids an internal exception in the connector
      options: {},
    }),
  ],
});

export default config;
