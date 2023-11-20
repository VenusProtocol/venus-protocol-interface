import { CHAIN_METADATA } from 'constants/chainMetadata';
import { useAuth } from 'context/AuthContext';

export const useGetChainMetadata = () => {
  const { chainId } = useAuth();
  return CHAIN_METADATA[chainId];
};
