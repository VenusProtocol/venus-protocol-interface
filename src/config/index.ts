import sample from 'lodash/sample';
import { BscChainId, Environment, Mode } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';

export interface Config {
  environment: Environment;
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
}

// Note: because Vite statically replaces env variables when building, we need
// to reference each of them by their full name
export const ENV_VARIABLES = {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
  VITE_ENVIRONMENT:
    typeof process !== 'undefined'
      ? process.env.VITE_ENVIRONMENT
      : import.meta.env.VITE_ENVIRONMENT,

  // Third-parties
  VITE_SENTRY_DSN:
    typeof process !== 'undefined' ? process.env.VITE_SENTRY_DSN : import.meta.env.VITE_SENTRY_DSN,
  VITE_POSTHOG_API_KEY:
    typeof process !== 'undefined'
      ? process.env.VITE_POSTHOG_API_KEY
      : import.meta.env.VITE_POSTHOG_API_KEY,
  VITE_POSTHOG_HOST_URL:
    typeof process !== 'undefined'
      ? process.env.VITE_POSTHOG_HOST_URL
      : import.meta.env.VITE_POSTHOG_HOST_URL,

  // Feature flags
  VITE_FF_ISOLATED_POOLS:
    typeof process !== 'undefined'
      ? process.env.VITE_FF_ISOLATED_POOLS
      : import.meta.env.VITE_FF_ISOLATED_POOLS,
  VITE_FF_INTEGRATED_SWAP:
    typeof process !== 'undefined'
      ? process.env.VITE_FF_INTEGRATED_SWAP
      : import.meta.env.VITE_FF_INTEGRATED_SWAP,
};

const environment: Environment =
  (ENV_VARIABLES.VITE_ENVIRONMENT as Environment | undefined) || 'mainnet';

const isOnTestnet =
  environment === 'testnet' || environment === 'storybook' || environment === 'ci';

const chainId: BscChainId = isOnTestnet ? 97 : 56;

const rpcUrl = sample(RPC_URLS[chainId]) as string;
const apiUrl = API_ENDPOINT_URLS[environment];
const bscScanUrl = BSC_SCAN_URLS[chainId];

const config: Config = {
  environment,
  chainId,
  isOnTestnet,
  rpcUrl,
  apiUrl,
  bscScanUrl,
  sentryDsn: ENV_VARIABLES.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: ENV_VARIABLES.VITE_POSTHOG_API_KEY || '',
    hostUrl: ENV_VARIABLES.VITE_POSTHOG_HOST_URL || '',
  },
};

export default config;
