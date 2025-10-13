import { tokens } from '@venusprotocol/chains';

import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

export interface UseGetTokensInput {
  chainId?: ChainId;
}

export const useGetTokens = (input?: UseGetTokensInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;

  return tokens[chainId];
};
