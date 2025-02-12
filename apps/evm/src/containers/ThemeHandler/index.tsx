import { ChainId } from '@venusprotocol/chains';
import { useChainId } from 'libs/wallet';
import { useEffect } from 'react';

export const ThemeHandler: React.FC = () => {
  const { chainId } = useChainId();

  // Change theme based on active chain
  useEffect(() => {
    document.body.classList.remove('unichain-theme');

    if (chainId === ChainId.UNICHAIN_MAINNET || chainId === ChainId.UNICHAIN_SEPOLIA) {
      document.body.classList.add('unichain-theme');
    }
  }, [chainId]);

  return undefined;
};
