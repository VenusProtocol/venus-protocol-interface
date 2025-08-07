import { useCallback } from 'react';
import type { To } from 'react-router';

import { CHAIN_ID_SEARCH_PARAM, useChainId } from 'libs/wallet';

export const useFormatTo = () => {
  const { chainId } = useChainId();

  const formatTo = useCallback(
    ({ to, searchParams = {} }: { to: To; searchParams?: Record<string, string> }) => {
      let searchString: string | undefined;

      if (typeof to !== 'string') {
        searchString = to.search;
      } else if (to.indexOf('?') > -1) {
        searchString = to.substring(to.indexOf('?'));
      }

      const currentSearchParams = new URLSearchParams(searchString);
      currentSearchParams.set(CHAIN_ID_SEARCH_PARAM, String(chainId));

      Object.entries(searchParams).forEach(([key, value]) => {
        currentSearchParams.set(key, value);
      });

      const search = `?${searchParams.toString()}`;

      if (typeof to === 'string') {
        return {
          pathname: to.indexOf('?') > -1 ? to.substring(0, to.indexOf('?')) : to,
          search,
        };
      }

      return {
        ...to,
        search,
      };
    },
    [chainId],
  );

  return { formatTo };
};
