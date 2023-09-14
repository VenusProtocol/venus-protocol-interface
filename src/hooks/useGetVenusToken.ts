import { useMemo } from 'react';

import useGetVenusTokens from './useGetTokens';

export interface UseGetVenusTokenInput {
  symbol: 'XVS' | 'VAI' | 'VRT';
}

function useGetVenusToken({ symbol }: UseGetVenusTokenInput) {
  const venusTokens = useGetVenusTokens();
  return useMemo(() => venusTokens.find(venusToken => venusToken.symbol === symbol), [venusTokens]);
}

export default useGetVenusToken;
