import { useMemo } from 'react';

import { useChainId } from 'libs/wallet';

import { getSwapTokens } from '../../utilities/getSwapTokens';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
