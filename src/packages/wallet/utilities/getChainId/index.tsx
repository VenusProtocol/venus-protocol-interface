import { getChainIdFromSearchParams } from 'packages/wallet/utilities/getChainIdFromSearchParams';

export const getChainId = () => {
  const searchParams = new URLSearchParams(document.location.search);
  return getChainIdFromSearchParams({ searchParams });
};
