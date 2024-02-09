// Note: because Vite statically replaces env variables when building, we need
// to reference each of them by their full name
export const ENV_VARIABLES = {
  NODE_ENV: typeof process !== 'undefined' ? process.env.NODE_ENV : undefined,
  VITE_ENVIRONMENT:
    typeof process !== 'undefined'
      ? process.env.VITE_ENVIRONMENT
      : import.meta.env.VITE_ENVIRONMENT,

  // BSC testnet RPC provider
  VITE_RPC_HTTP_URL_BSC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_BSC_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_BSC_MAINNET,
  VITE_RPC_WEBSOCKET_URL_BSC_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_BSC_MAINNET
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_BSC_MAINNET,

  // BSC mainnet RPC provider
  VITE_RPC_HTTP_URL_BSC_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_BSC_TESTNET
      : import.meta.env.VITE_RPC_HTTP_URL_BSC_TESTNET,
  VITE_RPC_WEBSOCKET_URL_BSC_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_BSC_TESTNET
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_BSC_TESTNET,

  // opBNB mainnet RPC provider
  VITE_RPC_HTTP_URL_OPBNB_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPBNB_MAINNET
      : import.meta.env.VITE_RPC_HTTP_URL_OPBNB_MAINNET,
  VITE_RPC_WEBSOCKET_URL_OPBNB_MAINNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_OPBNB_MAINNET
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_OPBNB_MAINNET,

  // opBNB testnet RPC provider
  VITE_RPC_HTTP_URL_OPBNB_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_OPBNB_TESTNET
      : import.meta.env.VITE_RPC_HTTP_URL_OPBNB_TESTNET,
  VITE_RPC_WEBSOCKET_URL_OPBNB_TESTNET:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_OPBNB_TESTNET
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_OPBNB_TESTNET,

  // Ethereum RPC provider
  VITE_RPC_HTTP_URL_ETHEREUM:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_ETHEREUM
      : import.meta.env.VITE_RPC_HTTP_URL_ETHEREUM,
  VITE_RPC_WEBSOCKET_URL_ETHEREUM:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_ETHEREUM
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_ETHEREUM,

  // Sepolia (Ethereum testnet) RPC provider
  VITE_RPC_HTTP_URL_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_HTTP_URL_SEPOLIA
      : import.meta.env.VITE_RPC_HTTP_URL_SEPOLIA,
  VITE_RPC_WEBSOCKET_URL_SEPOLIA:
    typeof process !== 'undefined'
      ? process.env.VITE_RPC_WEBSOCKET_URL_SEPOLIA
      : import.meta.env.VITE_RPC_WEBSOCKET_URL_SEPOLIA,

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
};
