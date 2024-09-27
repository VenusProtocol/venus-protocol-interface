// Note: because Vite statically replaces env variables when building, we need
// to reference each of them by their full name
export const ENV_VARIABLES = {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
  VITE_ENVIRONMENT:
    typeof process !== 'undefined'
      ? process.env.VITE_ENVIRONMENT
      : import.meta.env.VITE_ENVIRONMENT,

  // BSC mainnet
  VITE_RPC_HTTP_URL_BSC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_BSC_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_BSC_MAINNET,
  VITE_SUBGRAPH_MARKETS_URL_BSC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_BSC_MAINNET
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_BSC_MAINNET,
  VITE_SUBGRAPH_GOVERNANCE_URL_BSC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_BSC_MAINNET
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_BSC_MAINNET,

  // BSC testnet
  VITE_RPC_HTTP_URL_BSC_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_BSC_TESTNET
      : import.meta.env.VITE_RPC_HTTP_URL_BSC_TESTNET,
  VITE_SUBGRAPH_MARKETS_URL_BSC_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_BSC_TESTNET
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_BSC_TESTNET,
  VITE_SUBGRAPH_GOVERNANCE_URL_BSC_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_BSC_TESTNET
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_BSC_TESTNET,

  // opBNB mainnet
  VITE_RPC_HTTP_URL_OPBNB_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPBNB_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_OPBNB_MAINNET,
  VITE_SUBGRAPH_MARKETS_URL_OPBNB_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_OPBNB_MAINNET
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_OPBNB_MAINNET,

  // opBNB testnet
  VITE_RPC_HTTP_URL_OPBNB_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPBNB_TESTNET
      : import.meta.env.VITE_RPC_HTTP_URL_OPBNB_TESTNET,

  // Ethereum
  VITE_RPC_HTTP_URL_ETHEREUM:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ETHEREUM
      : import.meta.env.VITE_RPC_HTTP_URL_ETHEREUM,
  VITE_SUBGRAPH_MARKETS_URL_ETHEREUM:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_ETHEREUM
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_ETHEREUM,

  // Sepolia
  VITE_RPC_HTTP_URL_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_SEPOLIA
      : import.meta.env.VITE_RPC_HTTP_URL_SEPOLIA,
  VITE_SUBGRAPH_MARKETS_URL_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_SEPOLIA,

  // Arbitrum
  VITE_RPC_HTTP_URL_ARBITRUM_ONE:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ARBITRUM_ONE
      : import.meta.env.VITE_RPC_HTTP_URL_ARBITRUM_ONE,
  VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_ONE:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_ONE
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_ONE,

  // Arbitrum Sepolia
  VITE_RPC_HTTP_URL_ARBITRUM_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ARBITRUM_SEPOLIA
      : import.meta.env.VITE_RPC_HTTP_URL_ARBITRUM_SEPOLIA,
  VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_ARBITRUM_SEPOLIA,

  // zkSync Sepolia
  VITE_RPC_HTTP_URL_ZKSYNC_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ZKSYNC_SEPOLIA
      : import.meta.env.VITE_RPC_HTTP_URL_ZKSYNC_SEPOLIA,
  VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_SEPOLIA,
  VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_SEPOLIA,

  // zkSync mainnet
  VITE_RPC_HTTP_URL_ZKSYNC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ZKSYNC_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_ZKSYNC_MAINNET,
  VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_MAINNET
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_ZKSYNC_MAINNET,
  VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_MAINNET
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_ZKSYNC_MAINNET,

  // Optimism mainnet
  VITE_RPC_HTTP_URL_OPTIMISM_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPTIMISM_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_OPTIMISM_MAINNET,
  VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_MAINNET
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_MAINNET,
  VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_MAINNET
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_MAINNET,

  // Optimism Sepolia
  VITE_RPC_HTTP_URL_OPTIMISM_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPTIMISM_SEPOLIA
      : import.meta.env.VITE_RPC_HTTP_URL_OPTIMISM_SEPOLIA,
  VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_MARKETS_URL_OPTIMISM_SEPOLIA,
  VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_SEPOLIA
      : import.meta.env.VITE_SUBGRAPH_GOVERNANCE_URL_OPTIMISM_SEPOLIA,

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
  VITE_ZYFI_API_KEY:
    typeof process !== 'undefined'
      ? process.env.VITE_ZYFI_API_KEY
      : import.meta.env.VITE_ZYFI_API_KEY,
  VITE_ZYFI_SPONSORED_PAYMASTER_ENDPOINT:
    typeof process !== 'undefined'
      ? process.env.VITE_ZYFI_SPONSORED_PAYMASTER_ENDPOINT
      : import.meta.env.VITE_ZYFI_SPONSORED_PAYMASTER_ENDPOINT,
};
