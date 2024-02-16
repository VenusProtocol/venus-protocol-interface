import { getTokens } from '@venusprotocol/web3';
import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

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
