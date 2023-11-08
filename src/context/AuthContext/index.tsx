import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import * as Sentry from '@sentry/react';
import { VError, displayMutationError } from 'errors';
import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import React, { useCallback, useContext, useEffect } from 'react';
import { ChainId } from 'types';
import {
  ConnectorNotFoundError,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';

import useGetIsAddressAuthorized from 'clients/api/queries/getIsAddressAuthorized/useGetIsAddressAuthorized';
import { Connector, Provider, connectorIdByName } from 'clients/web3';
import { AuthModal } from 'components/AuthModal';
import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

import { store } from './store';
import useProvider from './useProvider';
import useSigner from './useSigner';

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
  const { address, isConnected } = useAccount();
  const { chain: walletChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const setStoreChainId = store.use.setChainId();
  const chainId = store.use.chainId();

  const signer = useSigner();
  const provider = useProvider();

  const { data: accountAuth } = useGetIsAddressAuthorized(address || '', {
    enabled: address !== undefined,
  });

  // Set address as authorized by default
  const isAuthorizedAddress = !accountAuth || accountAuth.authorized;
  const accountAddress = !!address && isAuthorizedAddress && isConnected ? address : undefined;

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

  const switchChain = async (input: { chainId: ChainId }) => {
    try {
      if (switchNetworkAsync) {
        // Change wallet network if it is connected
        await switchNetworkAsync(input.chainId);
      } else if (accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'couldNotSwitchChain',
        });
      }

      // Update store
      setStoreChainId(input);
    } catch (error) {
      if (error instanceof VError && error.code === 'couldNotSwitchChain') {
        displayMutationError({ error });
      }
    }
  };

  useEffect(() => {
    const fn = async () => {
      if (!walletChain) {
        return;
      }

      // Disconnect wallet if it connected to an unsupported chain
      if (walletChain.unsupported) {
        await logOut();
        return;
      }

      // Update store when wallet connects to a different chain
      if (walletChain.id !== chainId) {
        setStoreChainId({ chainId: walletChain.id });
      }
    };

    fn();
  }, [walletChain, chainId, setStoreChainId, logOut]);

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
