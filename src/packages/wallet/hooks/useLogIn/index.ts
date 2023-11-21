import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import { VError } from 'errors';
import { connectorIdByName } from 'packages/wallet/connectors';
import { Connector } from 'packages/wallet/types';
import { useCallback } from 'react';
import { ConnectorNotFoundError, useConnect } from 'wagmi';

import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

import { useChainId } from '../useChainId';

export const useLogIn = () => {
  const { connectAsync, connectors } = useConnect();
  const chainId = useChainId();

  const logIn = useCallback(
    async (connectorId: Connector) => {
      // If user is attempting to connect their Infinity wallet but the dApp
      // isn't currently running in the Infinity Wallet app, open it
      if (connectorId === Connector.InfinityWallet && !isRunningInInfinityWalletApp()) {
        openInfinityWallet(window.location.href, chainId);
        return;
      }

      const connector =
        connectors.find(item => item.id === connectorIdByName[connectorId]) || connectors[0];

      try {
        // Log user in
        await connectAsync({ connector, chainId });
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          throw new VError({ type: 'interaction', code: 'noProvider' });
        } else {
          // Do nothing
        }
      }
    },
    [chainId, connectAsync, connectors],
  );

  return logIn;
};
