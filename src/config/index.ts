import sample from 'lodash/sample';
import { BscChainId, Environment, Mode } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
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

const environment: Environment =
  (import.meta.env.VITE_APP_ENVIRONMENT as Environment | undefined) || 'mainnet';

const mode: Mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const isInLiveEnvironment =
  mode === 'production' &&
  (environment === 'testnet' || environment === 'preview' || environment === 'mainnet');

const chainId: BscChainId = import.meta.env.VITE_CHAIN_ID
  ? Number(import.meta.env.VITE_CHAIN_ID)
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
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: import.meta.env.VITE_POSTHOG_API_KEY || '',
    hostUrl: import.meta.env.VITE_POSTHOG_HOST_URL || '',
  },
  // Note: never access these directly, use the utility function
  // isFeatureEnabled instead. This is necessary to make testing easier
  featureFlags: {
    isolatedPools: import.meta.env.VITE_FF_ISOLATED_POOLS === 'true',
    integratedSwap: import.meta.env.VITE_FF_INTEGRATED_SWAP === 'true',
  },
};

export default config;
