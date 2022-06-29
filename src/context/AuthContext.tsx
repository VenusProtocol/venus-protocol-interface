import React from 'react';
import noop from 'noop-ts';

import { Connector, useAuth } from 'clients/web3';
import useCopyToClipboard from 'hooks/useCopyToClipoard';
import { AuthModal } from 'components/v2/AuthModal';
import { useTranslation } from 'translation';

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
