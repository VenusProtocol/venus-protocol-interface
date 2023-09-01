import localConfig from 'config';
import { ChainId } from 'packages/contracts';
import { Chain, configureChains, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import { WALLET_CONNECT_PROJECT_ID } from 'constants/walletConnect';

import { BinanceWalletConnector } from './binanceWalletConnector';

export const chains: Chain[] = localConfig.isOnTestnet ? [bscTestnet, bsc] : [bsc, bscTestnet];

const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [
    jsonRpcProvider({
      rpc: chain => localConfig.rpcUrls[chain.id as ChainId],
    }),
    publicProvider(),
  ],
  {
    batch: {
      multicall: false, // Disable wagmi's multicall feature as we wrap the provider with a 0xsequence multicall provider instead
    },
  },
);

const config = createConfig({
  autoConnect: true,
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
    new BinanceWalletConnector({
      chains,
    }),
  ],
});

export default config;
