import { getToken } from '@venusprotocol/chains';

import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

export interface UseGetTokenInput {
  symbol: string;
  chainId?: ChainId;
}

export const useGetToken = (input: UseGetTokenInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input.chainId || currentChainId;

  return getToken({ chainId, symbol: input.symbol });
};
