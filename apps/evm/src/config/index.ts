import type { ChainId, Environment, Network } from 'types';

import { apiHosts } from './apiUrls';
import { envVariables } from './envVariables';
import { rpcUrls } from './rpcUrls';

export interface Config {
  environment: Environment;
  network: Network;
  isSafeApp: boolean;
  apiUrl: string;
  wsApiUrl: string;
  rpcUrls: {
    [chainId in ChainId]: string[];
  };
  sentryDsn: string;
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
  zyFiApiKey: string;
  biconomyApiKey: string;
  safeApiKey: string;
}

const environment: Environment = envVariables.VITE_ENV || 'preview';
const network: Network = envVariables.VITE_NETWORK || 'mainnet';

const apiHost = apiHosts[network];
const apiUrl = `https://${apiHost}`;
const wsApiUrl = `wss://${apiHost}/ws`;

const isSafeApp = window?.location.ancestorOrigins?.[0] === 'https://app.safe.global';

const config: Config = {
  environment,
  network,
  isSafeApp,
  apiUrl,
  wsApiUrl,
  rpcUrls,
  sentryDsn: envVariables.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: envVariables.VITE_POSTHOG_API_KEY || '',
    hostUrl: envVariables.VITE_POSTHOG_HOST_URL || '',
  },
  zyFiApiKey: envVariables.VITE_ZYFI_API_KEY || '',
  biconomyApiKey: envVariables.VITE_BICONOMY_API_KEY || '',
  safeApiKey: envVariables.VITE_SAFE_API_KEY || '',
};

export { envVariables } from './envVariables';
export default config;
