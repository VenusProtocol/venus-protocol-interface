import { chains, defaultChain } from 'libs/wallet/chains';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet/utilities/getUnsafeChainIdFromSearchParams';
import type { ChainId } from 'types';

export const getChainId = (input?: { searchParams?: URLSearchParams }) => {
  const defaultedSearchParams =
    input?.searchParams || new URLSearchParams(`?${window.location.hash.split('?')[1]}`);
  let { chainId } = getUnsafeChainIdFromSearchParams({ searchParams: defaultedSearchParams });

  if (!chainId || !chains.some(chain => chain.id === chainId)) {
    chainId = defaultChain.id;
  }

  return {
    chainId: chainId as ChainId,
  };
};
