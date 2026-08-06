import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { chains, defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet/utilities/getUnsafeChainIdFromSearchParams';

import config from 'config';

export const UrlChainIdFallback = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (config.isSafeApp || !searchParams.has(CHAIN_ID_SEARCH_PARAM)) {
      return;
    }

    const { chainId } = getUnsafeChainIdFromSearchParams({ searchParams });
    const isSupportedChainId = chains.some(chain => chain.id === chainId);

    if (isSupportedChainId) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(CHAIN_ID_SEARCH_PARAM, defaultChain.id.toString());

    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return null;
};
