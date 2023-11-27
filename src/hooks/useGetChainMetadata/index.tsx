import { useChainId } from 'packages/wallet';

import { CHAIN_METADATA } from 'constants/chainMetadata';

export const useGetChainMetadata = () => {
  const { chainId } = useChainId();
  return CHAIN_METADATA[chainId];
};
