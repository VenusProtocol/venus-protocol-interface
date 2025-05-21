import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import type { ChainId } from 'types';

export const useUpdateUrlChainId = () => {
  const [, setSearchParams] = useSearchParams();

  const updateUrlChainId = useCallback(
    ({ chainId }: { chainId: ChainId }) =>
      setSearchParams(currentSearchParams => ({
        ...Object.fromEntries(currentSearchParams),
        chainId: String(chainId),
      })),
    [setSearchParams],
  );

  return { updateUrlChainId };
};
