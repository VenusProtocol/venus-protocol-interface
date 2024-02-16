import { getToken } from '@venusprotocol/web3';
import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

export interface UseGetTokenInput {
  symbol: string;
  chainId?: ChainId;
}

export const useGetToken = (input: UseGetTokenInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input.chainId || currentChainId;

  return useMemo(() => getToken({ chainId, symbol: input.symbol }), [chainId, input.symbol]);
};
