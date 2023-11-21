import { store } from 'packages/wallet/store';
import { useEffect } from 'react';
import { useDisconnect, useNetwork } from 'wagmi';

import { useChainId } from 'packages/wallet/hooks/useChainId';

export const ChainHandler: React.FC = () => {
  const { chain: walletChain } = useNetwork();
  const { disconnectAsync } = useDisconnect();
  const chainId = useChainId();
  const setStoreChainId = store.use.setChainId();

  useEffect(() => {
    const fn = async () => {
      if (!walletChain) {
        return;
      }

      // Disconnect wallet if it connected to an unsupported chain
      if (walletChain.unsupported) {
        await disconnectAsync();
        return;
      }

      // Update store when wallet connects to a different chain
      if (walletChain.id !== chainId) {
        setStoreChainId({ chainId: walletChain.id });
      }
    };

    fn();
  }, [walletChain, chainId, setStoreChainId, disconnectAsync]);

  return null;
};
