import { useMemo } from 'react';

import { getTokens } from '@venusprotocol/registry';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

export interface UseGetTokensInput {
  chainId?: ChainId;
}

export const useGetTokens = (input?: UseGetTokensInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;

  return useMemo(
    () =>
      getTokens({
        chainId,
      }),
    [chainId],
  );
};
