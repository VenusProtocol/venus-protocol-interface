import { chains, getBlockTimeByChainId } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

export const useChain = () => {
  const { chainId } = useChainId();
  const blockTime = getBlockTimeByChainId({ chainId });
  return {
    ...chains[chainId],
    ...blockTime,
  };
};
