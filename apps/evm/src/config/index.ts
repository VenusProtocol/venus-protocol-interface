import { apiUrls } from 'constants/api';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { productionHosts } from 'constants/production';
import { ChainId, type Environment, type Network } from 'types';
import { extractEnumValues } from 'utilities/extractEnumValues';
import { ENV_VARIABLES } from './envVariables';

export interface Config {
  environment: Environment;
  network: Network;
  apiUrl: string;
  rpcUrls: {
    [chainId in ChainId]: string;
  };
  marketsSubgraphUrls: {
    [chainId in ChainId]: string;
  };
  governanceSubgraphUrls: {
    [chainId in ChainId]: string;
  };
  sentryDsn: string;
  posthog: {
    apiKey: string;
    hostUrl: string;
  };
  zyFi: {
    apiKey: string;
    sponsoredPaymasterEndpoint: string;
  };
}

let environment: Environment = 'preview';

if (ENV_VARIABLES.VITE_ENV) {
  environment = ENV_VARIABLES.VITE_ENV;
} else if (typeof window !== 'undefined' && productionHosts.includes(window.location.host)) {
  environment = 'production';
} else if (import.meta.env.DEV) {
  environment = 'local';
}

const network: Network = ENV_VARIABLES.VITE_NETWORK || 'mainnet';

const chainIds = extractEnumValues(ChainId);

const { rpcUrls, marketsSubgraphUrls, governanceSubgraphUrls } = chainIds.reduce(
  (acc, chainId) => {
    const chainKey = ChainId[chainId];
    const chainMetadata = CHAIN_METADATA[chainId];

    return {
      rpcUrls: {
        ...acc.rpcUrls,
        [chainId]:
          ENV_VARIABLES[`VITE_RPC_HTTP_URL_${chainKey}` as keyof typeof ENV_VARIABLES] ||
          chainMetadata.rpcUrl,
      },
      marketsSubgraphUrls: {
        ...acc.marketsSubgraphUrls,
        [chainId]:
          ENV_VARIABLES[`VITE_SUBGRAPH_MARKETS_URL_${chainKey}` as keyof typeof ENV_VARIABLES] ||
          chainMetadata.marketsSubgraphUrl,
      },
      governanceSubgraphUrls: {
        ...acc.governanceSubgraphUrls,
        [chainId]:
          ENV_VARIABLES[`VITE_SUBGRAPH_GOVERNANCE_URL_${chainKey}` as keyof typeof ENV_VARIABLES] ||
          chainMetadata.governanceSubgraphUrl,
      },
    };
  },
  {
    rpcUrls: {},
    marketsSubgraphUrls: {},
    governanceSubgraphUrls: {},
  } as {
    rpcUrls: Record<ChainId, string>;
    marketsSubgraphUrls: Record<ChainId, string>;
    governanceSubgraphUrls: Record<ChainId, string>;
  },
);

const apiUrl = apiUrls[network];

const config: Config = {
  environment,
  network,
  apiUrl,
  rpcUrls,
  marketsSubgraphUrls,
  governanceSubgraphUrls,
  sentryDsn: ENV_VARIABLES.VITE_SENTRY_DSN || '',
  posthog: {
    apiKey: ENV_VARIABLES.VITE_POSTHOG_API_KEY || '',
    hostUrl: ENV_VARIABLES.VITE_POSTHOG_HOST_URL || '',
  },
  zyFi: {
    apiKey: ENV_VARIABLES.VITE_ZYFI_API_KEY || '',
    sponsoredPaymasterEndpoint: ENV_VARIABLES.VITE_ZYFI_SPONSORED_PAYMASTER_ENDPOINT || '',
  },
};

export { ENV_VARIABLES } from './envVariables';
export default config;
