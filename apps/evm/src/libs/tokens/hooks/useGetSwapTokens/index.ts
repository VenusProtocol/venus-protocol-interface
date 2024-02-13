import { getSwapTokens } from 'libs/tokens/utilities/getSwapTokens';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';

export const useGetSwapTokens = () => {
  const { chainId } = useChainId();
  return useMemo(() => getSwapTokens({ chainId }), [chainId]);
};
