// Note: because Vite statically replaces env variables when building, we need
// to reference each of them by their full name
export const envVariables = {
  VITE_ENV: typeof process !== 'undefined' ? process.env.VITE_ENV : import.meta.env.VITE_ENV,
  VITE_NETWORK:
    typeof process !== 'undefined' ? process.env.VITE_NETWORK : import.meta.env.VITE_NETWORK,

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
  VITE_NODE_REAL_API_KEY:
    typeof process !== 'undefined'
      ? process.env.VITE_NODE_REAL_API_KEY
      : import.meta.env.VITE_NODE_REAL_API_KEY,
  VITE_THE_GRAPH_API_KEY:
    typeof process !== 'undefined'
      ? process.env.VITE_THE_GRAPH_API_KEY
      : import.meta.env.VITE_THE_GRAPH_API_KEY,
};
