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
}

export const ENV_VARIABLES = typeof process !== 'undefined' ? process.env : import.meta.env;

const environment: Environment =
  (ENV_VARIABLES.VITE_ENVIRONMENT as Environment | undefined) || 'testnet';

const mode: Mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const isInLiveEnvironment =
  mode === 'production' &&
  (environment === 'testnet' || environment === 'preview' || environment === 'mainnet');

const chainId: BscChainId = environment === 'preview' || environment === 'mainnet' ? 56 : 97;

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
  sentryDsn: ENV_VARIABLES.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: ENV_VARIABLES.VITE_POSTHOG_API_KEY || '',
    hostUrl: ENV_VARIABLES.VITE_POSTHOG_HOST_URL || '',
  },
};

export default config;
