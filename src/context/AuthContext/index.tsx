import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import * as Sentry from '@sentry/react';
import { VError } from 'errors';
import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import {
  AuthModal,
  Connector,
  Provider,
  connectorIdByName,
  useAccountAddress,
  useChainId,
  useProvider,
  useSigner,
  useSwitchChain,
} from 'packages/wallet';
import { store } from 'packages/wallet/store';
import React, { useCallback, useContext, useEffect } from 'react';
import { ChainId } from 'types';
import { ConnectorNotFoundError, useConnect, useDisconnect } from 'wagmi';

import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  switchChain: (input: { chainId: ChainId }) => void;
  provider: Provider;
  chainId: ChainId;
  accountAddress?: string;
  signer?: Signer;
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  switchChain: noop,
  provider: getDefaultProvider(),
  chainId: store.getState().chainId,
});

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync: logOut } = useDisconnect();

  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const signer = useSigner();
  const provider = useProvider();
  const accountAddress = useAccountAddress();

  const login = useCallback(
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

  useEffect(() => {
    Sentry.setTag('chainId', chainId);
  }, [chainId]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = async (connector: Connector) => {
    await login(connector);
    closeAuthModal();
  };

  return (
    <AuthContext.Provider
      value={{
        accountAddress,
        login,
        logOut,
        openAuthModal,
        closeAuthModal,
        switchChain,
        provider,
        signer,
        chainId,
      }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        accountAddress={accountAddress}
        chainId={chainId}
        onLogOut={logOut}
        onLogin={handleLogin}
      />

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
