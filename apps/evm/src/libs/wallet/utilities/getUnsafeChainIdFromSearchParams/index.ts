import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';

export const getUnsafeChainIdFromSearchParams = ({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) => {
  const chainId = searchParams.get(CHAIN_ID_SEARCH_PARAM);

  return {
    chainId: chainId ? +chainId : undefined,
  };
};
