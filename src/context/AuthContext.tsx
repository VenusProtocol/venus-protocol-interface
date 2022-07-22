import noop from 'noop-ts';
import React from 'react';
import { useTranslation } from 'translation';

import { Connector, useAuth } from 'clients/web3';
import { AuthModal } from 'components/AuthModal';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

export interface Account {
  address: string;
  connector?: Connector;
}

export interface AuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  account?: Account;
}

export const AuthContext = React.createContext<AuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const { login, accountAddress, logOut, connectedConnector } = useAuth();

  const { t } = useTranslation();

  const copyWalletAddress = useCopyToClipboard(t('interactive.copy.walletAddress'));

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = (connector: Connector) => {
    login(connector);
    closeAuthModal();
  };

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
