import sample from 'lodash/sample';
import { BscChainId, Environment, Mode } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';

export interface Config {
  environment: Environment;
  mode: Mode;
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
}

// Note: because Vite statically replaces env variables when building, we need
// to reference each of them by their full name
export const ENV_VARIABLES = {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
  VITE_MODE: typeof process !== 'undefined' ? undefined : import.meta.env.MODE,
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

const mode: Mode =
  ENV_VARIABLES.NODE_ENV === 'development' || ENV_VARIABLES.VITE_MODE === 'development'
    ? 'development'
    : 'production';

const environment: Environment =
  (ENV_VARIABLES.VITE_ENVIRONMENT as Environment | undefined) || 'mainnet';

const mode: Mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const isInLiveEnvironment =
  mode === 'production' &&
  (environment === 'testnet' || environment === 'preview' || environment === 'mainnet');

const chainId: BscChainId =
  environment === 'testnet' || environment === 'storybook' || environment === 'ci' ? 97 : 56;

const isOnTestnet = chainId === BscChainId.TESTNET;
const rpcUrl = sample(RPC_URLS[chainId]) as string;
const apiUrl = API_ENDPOINT_URLS[environment];
const bscScanUrl = BSC_SCAN_URLS[chainId];

const config: Config = {
  environment,
  mode,
  isInLiveEnvironment,
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

console.log(config);

export default config;
