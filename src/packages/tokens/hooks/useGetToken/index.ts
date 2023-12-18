import { useMemo } from 'react';

import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';

import { useGetTokens } from '../useGetTokens';

export interface UseGetTokenInput {
  symbol: string;
  chainId?: ChainId;
}

export const useGetToken = (input: UseGetTokenInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input.chainId || currentChainId;
  const tokens = useGetTokens({ chainId });

  return useMemo(() => tokens.find(token => token.symbol === input.symbol), [tokens, input.symbol]);
};
