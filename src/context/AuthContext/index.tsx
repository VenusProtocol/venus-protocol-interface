import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import type { Provider } from '@wagmi/core';
import config from 'config';
import { VError } from 'errors';
import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'translation';
import {
  ConnectorNotFoundError,
  useAccount,
  useConnect,
  useDisconnect,
  useProvider,
  useSigner,
} from 'wagmi';

import useGetIsAddressAuthorized from 'clients/api/queries/getIsAddressAuthorized/useGetIsAddressAuthorized';
import { Connector, connectorIdByName } from 'clients/web3';
import { AuthModal } from 'components/AuthModal';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  provider: Provider;
  isConnected: boolean;
  accountAddress: string;
  signer?: Signer;
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  isConnected: false,
  provider: getDefaultProvider(),
  accountAddress: '',
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address, isConnected } = useAccount();

  const { data: accountAuth } = useGetIsAddressAuthorized(address || '', {
    enabled: address !== undefined,
  });

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
    } catch (error) {
      if (error instanceof ConnectorNotFoundError) {
        throw new VError({ type: 'interaction', code: 'noProvider' });
      }
    }
  }, []);

  const logOut = useCallback(async () => {
    await disconnectAsync();
  }, []);

  const { t } = useTranslation();

  const copyWalletAddress = useCopyToClipboard(t('interactive.copy.walletAddress'));

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = async (connector: Connector) => {
    await login(connector);
    closeAuthModal();
  };

  const accountAddress = isConnected && address && accountAuth?.authorized ? address : '';

  return (
    <AuthContext.Provider
      value={{
        accountAddress,
        login,
        logOut,
        openAuthModal,
        closeAuthModal,
        isConnected,
        provider,
        signer: signer || undefined,
      }}
    >
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        accountAddress={accountAddress}
        onLogOut={logOut}
        onLogin={handleLogin}
        onCopyAccountAddress={copyWalletAddress}
      />

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
