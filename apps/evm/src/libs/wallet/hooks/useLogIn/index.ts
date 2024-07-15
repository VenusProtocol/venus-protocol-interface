import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import { useCallback } from 'react';
import { ConnectorNotFoundError, ProviderNotFoundError, useConnect } from 'wagmi';

import { VError } from 'libs/errors';
import type { ConnectorId } from 'libs/wallet';
import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

import { useChainId } from '../useChainId';

export const useLogIn = () => {
  const { connectAsync, connectors } = useConnect();
  const { chainId } = useChainId();

  const logIn = useCallback(
    async (connectorId: ConnectorId) => {
      // If user is attempting to connect their Infinity wallet but the dApp
      // isn't currently running in the Infinity Wallet app, open it
      if (connectorId === 'io.infinitywallet' && !isRunningInInfinityWalletApp()) {
        openInfinityWallet(window.location.href, chainId);
        return;
      }

      const connector = connectors.find(c => c.id === connectorId);

      if (!connector) {
        throw new VError({ type: 'interaction', code: 'noProvider' });
      }

      try {
        // Log user in
        await connectAsync({ connector, chainId });
      } catch (error) {
        if (error instanceof ProviderNotFoundError || error instanceof ConnectorNotFoundError) {
          throw new VError({ type: 'interaction', code: 'noProvider' });
        }
      }
    },
    [chainId, connectAsync, connectors],
  );

  return { logIn };
};
