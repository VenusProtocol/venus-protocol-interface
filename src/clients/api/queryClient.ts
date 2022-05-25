import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a stale time of 10 seconds so query results don't get wiped out of
      // the cache instantly after their hook unmounts (see documentation for
      // more info: https://react-query.tanstack.com/guides/important-defaults)
      staleTime: 10000,
    },
  },
});
export default queryClient;
