import { useMemo } from 'react';

import useGetVenusTokens from './useGetTokens';

export interface UseGetTokenInput {
  symbol: string;
}

function useGetToken({ symbol }: UseGetTokenInput) {
  const venusTokens = useGetVenusTokens();
  return useMemo(() => venusTokens.find(venusToken => venusToken.symbol === symbol), [venusTokens]);
}

export default useGetToken;
