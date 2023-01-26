import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import type { Provider } from '@wagmi/core';
import config from 'config';
import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { useAccount, useConnect, useDisconnect, useProvider, useSigner } from 'wagmi';

import { Connector, connectorIdByName } from 'clients/web3';
import { AuthModal } from 'components/AuthModal';
import { LS_KEY_CONNECTED_CONNECTOR } from 'constants/localStorageKeys';
import getConnectedConnector from 'context/AuthContext/getConnectedConnector';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

export interface Account {
  address: string;
  connector?: Connector;
}

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  provider: Provider;
  account?: Account;
  signer?: Signer;
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  provider: getDefaultProvider(),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address, status } = useAccount();

  const [connectedConnector, setConnectedConnector] = useState(getConnectedConnector());

  const login = useCallback(async (connectorId: Connector) => {
    // If user is attempting to connect their Infinity wallet but the dApp
    // isn't currently running in the Infinity Wallet app, open it
    if (connectorId === Connector.InfinityWallet && !isRunningInInfinityWalletApp()) {
      openInfinityWallet(window.location.href, config.chainId);
      return;
    }

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

  const { t } = useTranslation();

  const copyWalletAddress = useCopyToClipboard(t('interactive.copy.walletAddress'));

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = (connector: Connector) => {
    login(connector);
    closeAuthModal();
  };

  const accountAddress = address && status === 'connected' ? address : undefined;
  const account = accountAddress
    ? {
        address: accountAddress,
        connector: connectedConnector,
      }
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        account,
        login,
        logOut,
        openAuthModal,
        closeAuthModal,
        provider,
        signer: signer || undefined,
      }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        account={account}
        onLogOut={logOut}
        onLogin={handleLogin}
        onCopyAccountAddress={copyWalletAddress}
      />

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
