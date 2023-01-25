import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import config from 'config';
import { useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useProvider, useSigner } from 'wagmi';

import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys';

import { connectorIdByName } from '../connectors';
import { Connector } from '../types';
import { isRunningInInfinityWalletApp } from '../walletDetectionUtils';
import getConnectedConnector from './getConnectedConnector';

const useAuth = () => {
  const { address: accountAddress } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [connectedConnector, setConnectedConnector] = useState(getConnectedConnector());

  const login = useCallback(async (connectorId: Connector) => {
    // If user is attempting to connect their Infinity wallet but the dApp
    // isn't currently running in the Infinity Wallet app, open it
    if (connectorId === Connector.InfinityWallet && !isRunningInInfinityWalletApp()) {
      openInfinityWallet(window.location.href, config.chainId);
      return;
    }

    // TODO: determine based on connector ID passed
    const connector =
      connectors.find(item => item.id === connectorIdByName[connectorId]) || connectors[0];

    try {
      // Log user in
      await connectAsync({ connector, chainId: config.chainId });

      // Mark user as logged in
      window.localStorage.setItem(LS_KEY_CONNECTED_CONNECTOR, connectorId);
      setConnectedConnector(connectorId);
    } catch (error) {
      // Do nothing, failing scenarios are handled by wagmi
    }
  }, []);

  const logOut = useCallback(async () => {
    await disconnectAsync();

    // Remove flag indicating user is logged in
    window.localStorage.removeItem(LS_KEY_CONNECTED_CONNECTOR);
    setConnectedConnector(undefined);
  }, []);

  return {
    login,
    logOut,
    accountAddress,
    connectedConnector,
    provider,
    signer: signer || undefined,
  };
};

export default useAuth;
