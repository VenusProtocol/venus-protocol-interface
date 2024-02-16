import { CHAIN_METADATA } from '@venusprotocol/web3';

import { useChainId } from 'libs/wallet';

export const useGetChainMetadata = () => {
  const { chainId } = useChainId();
  return CHAIN_METADATA[chainId];
};
