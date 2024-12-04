import type { ChainId, Environment, Network } from 'types';

import { apiUrls } from './apiUrls';
import { envVariables } from './envVariables';
import { rpcUrls } from './rpcUrls';
import { getGovernanceSubgraphUrls, getIsolatedPoolsSubgraphUrls } from './subgraphUrls';

export interface Config {
  environment: Environment;
  network: Network;
  apiUrl: string;
  rpcUrls: {
    [chainId in ChainId]: string;
  };
  isolatedPoolsSubgraphUrls: {
    [chainId in ChainId]: string | undefined;
  };
  governanceSubgraphUrls: {
    [chainId in ChainId]: string | undefined;
  };
  sentryDsn: string;
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
  zyFiApiKey: string;
}

const environment: Environment = envVariables.VITE_ENV || 'preview';
const network: Network = envVariables.VITE_NETWORK || 'mainnet';

const apiUrl = apiUrls[network];

const keys = {
  nodeRealApiKey: envVariables.VITE_NODE_REAL_API_KEY,
  theGraphApiKey: envVariables.VITE_THE_GRAPH_API_KEY,
};

const governanceSubgraphUrls = getGovernanceSubgraphUrls(keys);
const isolatedPoolsSubgraphUrls = getIsolatedPoolsSubgraphUrls(keys);

const config: Config = {
  environment,
  network,
  apiUrl,
  rpcUrls,
  isolatedPoolsSubgraphUrls,
  governanceSubgraphUrls,
  sentryDsn: envVariables.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: envVariables.VITE_POSTHOG_API_KEY || '',
    hostUrl: envVariables.VITE_POSTHOG_HOST_URL || '',
  },
  zyFiApiKey: envVariables.VITE_ZYFI_API_KEY || '',
};

export { envVariables } from './envVariables';
export default config;
