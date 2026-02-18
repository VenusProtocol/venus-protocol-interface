import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  binanceWallet,
  okxWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import type { Chain } from 'viem';
import { http, createConfig, fallback } from 'wagmi';

import localConfig from 'config';
import type { ChainId } from 'types';
import { chains } from '../chains';
import { WALLET_CONNECT_PROJECT_ID } from '../constants';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [binanceWallet, okxWallet, walletConnectWallet, trustWallet],
    },
  ],
  { appName: 'Venus', projectId: WALLET_CONNECT_PROJECT_ID },
);

const config = createConfig({
  chains: chains as [Chain, ...Chain[]],
  connectors,
  transports: chains.reduce((acc, chain) => {
    const urls = localConfig.rpcUrls[chain.id as ChainId];

    return {
      ...acc,
      [chain.id]: fallback([
        ...urls.map(url => http(url)),
        // Add public RPC Node as a last resort solution
        http(),
      ]),
    };
  }, {}),
  batch: {
    multicall: {
      wait: 50,
    },
  },
});

export default config;
