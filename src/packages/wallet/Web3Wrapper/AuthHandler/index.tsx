import { store } from 'packages/wallet/store';
import { useEffect } from 'react';
import { useConfig, useDisconnect, useNetwork } from 'wagmi';

import { useChainId } from 'packages/wallet/hooks/useChainId';

export const AuthHandler: React.FC = () => {
  const config = useConfig();
  const { chain: walletChain } = useNetwork();
  const { disconnectAsync } = useDisconnect();
  const { chainId } = useChainId();
  const setStoreChainId = store.use.setChainId();

  // This is a workaround to prevent an issue where a locked wallet extension returns an account
  // address but no signer. By setting the autoConnect property of wagmi's config to false and
  // manually triggering the autoConnect function, locked wallets will be automatically detected as
  // being disconnected
  useEffect(() => {
    config.autoConnect();
  }, [config]);

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
