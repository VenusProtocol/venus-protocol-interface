import type { ChainId } from '@venusprotocol/chains';
import { useCallback } from 'react';
import type { To } from 'react-router';

import { CHAIN_ID_SEARCH_PARAM, useChainId } from 'libs/wallet';

export const useFormatTo = () => {
  const { chainId: currentChainId } = useChainId();

  const formatTo = useCallback(
    ({ to, chainId }: { to: To; chainId?: ChainId }) => {
      let searchString: string | undefined;
      if (typeof to !== 'string') {
        searchString = to.search;
      } else if (to.indexOf('?') > -1) {
        searchString = to.substring(to.indexOf('?'));
      }

      const searchParams = new URLSearchParams(searchString);
      searchParams.set(CHAIN_ID_SEARCH_PARAM, String(chainId ?? currentChainId));
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
    [currentChainId],
  );

  return { formatTo };
};
