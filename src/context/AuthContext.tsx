import React from 'react';
import noop from 'noop-ts';
import copyToClipboard from 'copy-to-clipboard';

import { Connector, useAuth } from 'clients/web3';
import toast from 'components/Basic/Toast';
import { AuthModal } from 'components/v2/AuthModal';

export interface IAccount {
  address: string;
  connector?: Connector;
}

export interface IAuthContextValue {
  login: (connector: Connector) => Promise<void>;
  logOut: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  account?: IAccount;
}

export const AuthContext = React.createContext<IAuthContextValue>({
  login: noop,
  logOut: noop,
  openAuthModal: noop,
  closeAuthModal: noop,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const { login, accountAddress, logOut, connectedConnector } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLogin = (connector: Connector) => {
    login(connector);
    closeAuthModal();
  };

  const handleCopyAccountAddress = (accountAddressToCopy: string) => {
    copyToClipboard(accountAddressToCopy);

    toast.success({
      title: 'Wallet address copied to clipboard',
    });
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
        onCopyAccountAddress={handleCopyAccountAddress}
      />

      {children}
    </AuthContext.Provider>
  );
};
