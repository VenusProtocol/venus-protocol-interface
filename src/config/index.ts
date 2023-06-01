import sample from 'lodash/sample';
import { BscChainId, Environment } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
import { DAPP_HOSTS } from 'constants/dAppHosts';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';

export interface Config {
  environment: Environment;
  isInLiveEnvironment: boolean;
  chainId: BscChainId;
  isOnTestnet: boolean;
  rpcUrl: string;
  apiUrl: string;
  bscScanUrl: string;
  sentryDsn: string;
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
  featureFlags: {
    isolatedPools: boolean;
    integratedSwap: boolean;
  };
}

let environment: Environment = 'local';

if (!window) {
  environment = 'mock';
} else if (DAPP_HOSTS.testnet.includes(window.location.host)) {
  environment = 'testnet';
} else if (DAPP_HOSTS.preview.includes(window.location.host)) {
  environment = 'preview';
} else if (DAPP_HOSTS.mainnet === window.location.host) {
  environment = 'mainnet';
}

const isInLiveEnvironment =
  environment === 'testnet' || environment === 'preview' || environment === 'mainnet';

const chainId: BscChainId = process.env.REACT_APP_CHAIN_ID
  ? Number(process.env.REACT_APP_CHAIN_ID)
  : BscChainId.MAINNET;

const isOnTestnet = chainId === BscChainId.TESTNET;
const rpcUrl = sample(RPC_URLS[chainId]) as string;
const apiUrl = API_ENDPOINT_URLS[environment];
const bscScanUrl = BSC_SCAN_URLS[chainId];

const config: Config = {
  environment,
  isInLiveEnvironment,
  chainId,
  isOnTestnet,
  rpcUrl,
  apiUrl,
  bscScanUrl,
  sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
  posthog: {
    apiKey: process.env.REACT_APP_POSTHOG_API_KEY || '',
    hostUrl: process.env.REACT_APP_POSTHOG_HOST_URL || '',
  },
  // Note: never access these directly, use the utility function
  // isFeatureEnabled instead. This is necessary to make testing easier
  featureFlags: {
    isolatedPools: process.env.REACT_APP_FF_ISOLATED_POOLS === 'true',
    integratedSwap: process.env.REACT_APP_FF_INTEGRATED_SWAP === 'true',
  },
};

export default config;
