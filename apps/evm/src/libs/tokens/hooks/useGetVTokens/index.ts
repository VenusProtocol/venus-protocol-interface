import { vTokens } from '@venusprotocol/chains';

import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

export interface UseGetVTokensInput {
  chainId?: ChainId;
}

export const useGetVTokens = (input?: UseGetVTokensInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;

  return vTokens[chainId];
};
