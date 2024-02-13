import { useMemo } from 'react';

import { getSwapTokens } from 'libs/tokens/utilities/getSwapTokens';
import { useChainId } from 'libs/wallet';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
