import { ChainId } from 'packages/contracts';
import { Environment } from 'types';

import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';

import { MAINNET_SUBGRAPH_URL, TESTNET_SUBGRAPH_URL } from './codegen';
import { ENV_VARIABLES } from './envVariables';

export interface Config {
  environment: Environment;
  isOnTestnet: boolean;
  isLocalServer: boolean;
  apiUrl: string;
  rpcUrls: {
    [chainId in ChainId]: {
      http: string;
      webSocket?: string;
    };
  };
  subgraphUrl: string;
  sentryDsn: string;
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
}

const environment: Environment =
  (ENV_VARIABLES.VITE_ENVIRONMENT as Environment | undefined) || 'mainnet';

const isOnTestnet =
  environment === 'testnet' || environment === 'storybook' || environment === 'ci';

const isLocalServer = import.meta.env.DEV && environment !== 'ci' && environment !== 'storybook';
const rpcUrls = isLocalServer
  ? {
      [ChainId.BSC_MAINNET]: {
        http: ENV_VARIABLES.VITE_RPC_HTTP_URL_BSC_MAINNET,
        webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_BSC_MAINNET,
      },
      [ChainId.BSC_TESTNET]: {
        http: ENV_VARIABLES.VITE_RPC_HTTP_URL_BSC_TESTNET,
        webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_BSC_TESTNET,
      },
    }
  : RPC_URLS;

const apiUrl = API_ENDPOINT_URLS[environment];
const subgraphUrl = isOnTestnet ? TESTNET_SUBGRAPH_URL : MAINNET_SUBGRAPH_URL;

const config: Config = {
  environment,
  isOnTestnet,
  isLocalServer,
  apiUrl,
  rpcUrls,
  subgraphUrl,
  sentryDsn: ENV_VARIABLES.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: ENV_VARIABLES.VITE_POSTHOG_API_KEY || '',
    hostUrl: ENV_VARIABLES.VITE_POSTHOG_HOST_URL || '',
  },
};

export { ENV_VARIABLES } from './envVariables';
export default config;
