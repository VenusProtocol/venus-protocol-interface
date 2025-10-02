import { chains } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

export const useGetChain = () => {
  const { chainId } = useChainId();
  return chains[chainId];
};
