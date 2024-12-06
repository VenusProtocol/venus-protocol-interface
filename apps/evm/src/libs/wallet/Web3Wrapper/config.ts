import { getDefaultConfig } from 'connectkit';
import { http, createConfig } from 'wagmi';

import localConfig from 'config';
import type { ChainId } from 'types';
import type { Chain, Transport } from 'viem';
import { chains } from '../chains';
import { WALLET_CONNECT_PROJECT_ID } from '../constants';

const connectKitConfig = getDefaultConfig({
  chains: chains as [Chain, ...Chain[]],
  transports: chains.reduce((acc, chain) => {
    const url = localConfig.rpcUrls[chain.id as ChainId];

    return {
      ...acc,
      [chain.id]: http(url),
    };
  }, {}) as Record<ChainId, Transport>,
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  appName: 'Venus',
  appUrl: 'https://app.venus.io',
  appDescription:
    'Venus is a decentralized finance (DeFi) algorithmic money market protocol on EVM networks.',
  appIcon: 'https://venus.io/180x180.png',
});

const config = createConfig(connectKitConfig);

export default config;
