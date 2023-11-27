import { useChainId } from 'packages/wallet';
import { useMemo } from 'react';

import { getSwapTokens } from 'packages/tokens/utilities/getSwapTokens';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
