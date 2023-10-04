import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';
import { getSwapTokens } from 'packages/tokens/utilities/getSwapTokens';

export const useGetSwapTokens = () => {
  const { chainId } = useAuth();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
