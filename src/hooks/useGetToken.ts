import { useMemo } from 'react';

import useGetTokens from './useGetTokens';

export interface UseGetTokenInput {
  symbol: string;
}

function useGetToken({ symbol }: UseGetTokenInput) {
  const tokens = useGetTokens();
  return useMemo(() => tokens.find(token => token.symbol === symbol), [tokens]);
}

export default useGetToken;
