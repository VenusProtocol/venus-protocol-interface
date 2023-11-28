import { useMemo } from 'react';

import { getSwapTokens } from 'packages/tokens/utilities/getSwapTokens';
import { useChainId } from 'packages/wallet';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
