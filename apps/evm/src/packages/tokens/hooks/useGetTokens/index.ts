import { useMemo } from 'react';

import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';

import { getTokens } from '../../utilities/getTokens';

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
