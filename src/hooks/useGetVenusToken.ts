import { useMemo } from 'react';
import { VenusTokenSymbol } from 'types';

import useGetVenusTokens from './useGetTokens';

export interface UseGetVenusTokenInput {
  symbol: VenusTokenSymbol;
}

function useGetVenusToken({ symbol }: UseGetVenusTokenInput) {
  const venusTokens = useGetVenusTokens();
  return useMemo(() => venusTokens.find(venusToken => venusToken.symbol === symbol), [venusTokens]);
}

export default useGetVenusToken;
