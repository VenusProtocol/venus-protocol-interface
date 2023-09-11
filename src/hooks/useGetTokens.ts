import { getTokens } from 'packages/tokens';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

function useGetTokens() {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      getTokens({
        chainId,
      }),
    [chainId],
  );
}

export default useGetTokens;
