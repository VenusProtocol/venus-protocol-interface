import { getDefaultConfig } from 'connectkit';
import { http, createConfig, fallback } from 'wagmi';

import localConfig from 'config';
import { MAIN_PRODUCTION_HOST } from 'constants/production';
import type { ChainId } from 'types';
import type { Chain } from 'viem';
import { chains } from '../chains';
import { WALLET_CONNECT_PROJECT_ID } from '../constants';

const connectKitConfig = getDefaultConfig({
  chains: chains as [Chain, ...Chain[]],
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
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  appName: 'Venus',
  appUrl: `https://${MAIN_PRODUCTION_HOST}`,
  appDescription:
    'Venus is a decentralized finance (DeFi) algorithmic money market protocol on EVM networks.',
  appIcon: 'https://venus.io/180x180.png',
  batch: {
    multicall: {
      wait: 50,
    },
  },
});

const config = createConfig(connectKitConfig);

export default config;
