import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import { getToken } from '../../utilities/getToken';

export interface UseGetTokenInput {
  symbol: string;
  chainId?: ChainId;
}

export const useGetToken = (input: UseGetTokenInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input.chainId || currentChainId;

  return useMemo(() => getToken({ chainId, symbol: input.symbol }), [chainId, input.symbol]);
};
