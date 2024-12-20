import { chainMetadata } from '@venusprotocol/registry';
import { useChainId } from 'libs/wallet';

export const useGetChainMetadata = () => {
  const { chainId } = useChainId();
  return chainMetadata[chainId];
};
