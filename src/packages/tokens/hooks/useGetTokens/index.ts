import { useMemo } from 'react';

import { useChainId } from 'packages/wallet';

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
