import { chains, defaultChain } from 'packages/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'packages/wallet/constants';
import { ChainId } from 'types';

export const getChainIdFromSearchParams = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const searchParamsChainId = searchParams.get(CHAIN_ID_SEARCH_PARAM);
  let chainId: ChainId = defaultChain.id;

  // Check chainId in URL is supported
  if (searchParamsChainId && chains.some(chain => chain.id === +searchParamsChainId)) {
    chainId = +searchParamsChainId;
  }

  return { chainId };
};
