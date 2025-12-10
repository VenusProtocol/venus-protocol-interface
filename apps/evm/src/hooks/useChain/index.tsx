import { chains } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

export const useChain = () => {
  const { chainId } = useChainId();
  return chains[chainId];
};
