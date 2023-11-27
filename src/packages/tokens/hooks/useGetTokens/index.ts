import { useChainId } from 'packages/wallet';
import { useMemo } from 'react';

import { getTokens } from '../../utilities/getTokens';

export const useGetTokens = () => {
  const { chainId } = useChainId();

  return useMemo(
    () =>
      getTokens({
        chainId,
      }),
    [chainId],
  );
};
