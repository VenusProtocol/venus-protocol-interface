import { useCallback } from 'react';
import { To } from 'react-router-dom';

import { CHAIN_ID_SEARCH_PARAM } from 'packages/wallet/constants';
import { useChainId } from 'packages/wallet/hooks/useChainId';

export const useFormatTo = () => {
  const { chainId } = useChainId();

  const formatTo = useCallback(
    ({ to }: { to: To }) => {
      let searchString: string | undefined;
      if (typeof to !== 'string') {
        searchString = to.search;
      } else if (to.indexOf('?') > -1) {
        searchString = to.substring(to.indexOf('?'));
      }

      const searchParams = new URLSearchParams(searchString);
      searchParams.set(CHAIN_ID_SEARCH_PARAM, String(chainId));
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

  return formatTo;
};
