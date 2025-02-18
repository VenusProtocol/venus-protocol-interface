import { ChainId } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';

export const useIsOnUnichain = () => {
  const { chainId } = useChainId();

  return chainId === ChainId.UNICHAIN_MAINNET || chainId === ChainId.UNICHAIN_SEPOLIA;
};
