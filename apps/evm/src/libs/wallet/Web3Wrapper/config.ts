import { getWagmiConnectorV2 as getBinanceWalletConnector } from '@binance/w3w-wagmi-connector-v2';
import { http, createConfig } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import localConfig from 'config';
import type { ChainId } from 'types';
import type { Transport } from 'viem';
import { chains } from '../chains';
import { WALLET_CONNECT_PROJECT_ID } from '../constants';

export const binanceWalletConnector = getBinanceWalletConnector();

const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
    }),
    coinbaseWallet({
      appName: 'Venus',
    }),
    binanceWalletConnector(),
  ],
  transports: chains.reduce((acc, chain) => {
    const url = localConfig.rpcUrls[chain.id as ChainId];

    return {
      ...acc,
      [chain.id]: http(url),
    };
  }, {}) as Record<ChainId, Transport>,
});

export default config;
