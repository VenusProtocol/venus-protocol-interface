import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useChainId } from 'libs/wallet';

export const useGetChainMetadata = () => {
  const { chainId } = useChainId();
  return CHAIN_METADATA[chainId];
};
