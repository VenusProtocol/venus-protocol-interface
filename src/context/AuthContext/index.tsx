import { openInfinityWallet } from '@infinitywallet/infinity-connector';
import config from 'config';
import { VError } from 'errors';
import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import React, { useCallback, useContext, useEffect } from 'react';
import { ChainId } from 'types';
import { ConnectorNotFoundError, useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

import useGetIsAddressAuthorized from 'clients/api/queries/getIsAddressAuthorized/useGetIsAddressAuthorized';
import { Connector, Provider, chains, connectorIdByName } from 'clients/web3';
import { AuthModal } from 'components/AuthModal';
import { logError } from 'context/ErrorLogger';
import { isRunningInInfinityWalletApp } from 'utilities/walletDetection';

import useProvider from './useProvider';
import useSigner from './useSigner';

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  provider: Provider;
  chainId: ChainId;
  isPrime: boolean;
  accountAddress?: string;
  signer?: Signer;
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
  isPrime: false,
  provider: getDefaultProvider(),
  chainId: ChainId.BSC_MAINNET,
});

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // TODO: get from chain instead of config
  const chainId = config.isOnTestnet ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET;

  // TODO: fetch
  const isPrime = true;

  const signer = useSigner();
  const provider = useProvider();

  const { data: accountAuth } = useGetIsAddressAuthorized(address || '', {
    enabled: address !== undefined,
  });

  // Set address as authorized by default
  const isAuthorizedAddress = !accountAuth || accountAuth.authorized;
  const accountAddress = !!address && isAuthorizedAddress && isConnected ? address : undefined;

  const login = useCallback(async (connectorId: Connector) => {
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
        logError(error);
      }
    }
  }, []);

  const logOut = useCallback(async () => {
    await disconnectAsync();
  }, []);

  // Disconnect wallet if it's connected to an unsupported network
  useEffect(() => {
    const fn = async () => {
      if (
        !!accountAddress &&
        chain &&
        chains.every(supportedChain => supportedChain.id !== chain.id)
      ) {
        await logOut();
      }
    };

    fn();
  }, [chain?.id, accountAddress]);

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
        provider,
        signer,
        chainId,
        isPrime,
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
