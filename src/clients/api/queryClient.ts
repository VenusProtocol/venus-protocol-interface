import { logError } from 'errors';
import { store } from 'packages/wallet/store';
import { QueryClient } from 'react-query';
import { ChainId } from 'types';

const onError = (error: unknown) => {
  const { chainId } = store.getState();

  // Log errors happening on the Ethereum and Sepolia network only. This is temporary so we can
  // track errors while the multichain feature is being tested by users
  if (chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA) {
    logError(error);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a stale time of 10 seconds so query results don't get wiped out of
      // the cache instantly after their hook unmounts (see documentation for
      // more info: https://react-query.tanstack.com/guides/important-defaults)
      staleTime: 10000,
      onError,
    },
    mutations: {
      onError,
    },
  },
});

export default queryClient;
