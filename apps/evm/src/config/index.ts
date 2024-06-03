import { API_ENDPOINT_URLS } from 'constants/endpoints';
import { ChainId, type Environment } from 'types';

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

const rpcUrls = {
  [ChainId.BSC_MAINNET]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_BSC_MAINNET,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_BSC_MAINNET,
  },
  [ChainId.BSC_TESTNET]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_BSC_TESTNET,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_BSC_TESTNET,
  },
  [ChainId.OPBNB_MAINNET]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_OPBNB_MAINNET,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_OPBNB_MAINNET,
  },
  [ChainId.OPBNB_TESTNET]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_OPBNB_TESTNET,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_OPBNB_TESTNET,
  },
  [ChainId.ETHEREUM]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_ETHEREUM,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_ETHEREUM,
  },
  [ChainId.SEPOLIA]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_SEPOLIA,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_SEPOLIA,
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    http: ENV_VARIABLES.VITE_RPC_HTTP_URL_ARBITRUM_SEPOLIA,
    webSocket: ENV_VARIABLES.VITE_RPC_WEBSOCKET_URL_ARBITRUM_SEPOLIA,
  },
};

const apiUrl = API_ENDPOINT_URLS[environment];

const config: Config = {
  environment,
  isOnTestnet,
  isLocalServer,
  apiUrl,
  rpcUrls,
  sentryDsn: ENV_VARIABLES.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: ENV_VARIABLES.VITE_POSTHOG_API_KEY || '',
    hostUrl: ENV_VARIABLES.VITE_POSTHOG_HOST_URL || '',
  },
};

export { ENV_VARIABLES } from './envVariables';
export default config;
