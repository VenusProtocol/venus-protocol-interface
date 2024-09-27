import { chainMetadata } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

export const useGetChainMetadata = () => {
  const { chainId } = useChainId();
  return chainMetadata[chainId];
};
