import { getSwapTokens } from '@venusprotocol/web3';
import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();

  console.log('getSwapTokens', getSwapTokens);

  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
