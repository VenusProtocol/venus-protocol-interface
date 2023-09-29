import { useMemo } from 'react';

import { getTokens } from '../../utilities/getTokens';
import { useAuth } from 'context/AuthContext';

export const useGetTokens = () => {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      getTokens({
        chainId,
      }),
    [chainId],
  );
};
