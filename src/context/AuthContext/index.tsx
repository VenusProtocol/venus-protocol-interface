import { Signer, getDefaultProvider } from 'ethers';
import noop from 'noop-ts';
import {
  Provider,
  useAccountAddress,
  useChainId,
  useProvider,
  useSigner,
  useSwitchChain,
} from 'packages/wallet';
import { store } from 'packages/wallet/store';
import React, { useContext } from 'react';
import { ChainId } from 'types';

export interface AuthContextValue {
  openAuthModal: () => void;
  closeAuthModal: () => void;
  switchChain: (input: { chainId: ChainId }) => void;
  provider: Provider;
  chainId: ChainId;
  accountAddress?: string;
  signer?: Signer;
}

export const AuthContext = React.createContext<AuthContextValue>({
  openAuthModal: noop,
  closeAuthModal: noop,
  switchChain: noop,
  provider: getDefaultProvider(),
  chainId: store.getState().chainId,
});

export interface AuthProviderProps {
  children?: React.ReactNode;
}

// TODO: remove in favor of using hooks from wallet package separately (see VEN-2143)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const signer = useSigner();
  const provider = useProvider();
  const { accountAddress } = useAccountAddress();

  const setIsAuthModalOpen = store.use.setIsAuthModalOpen();
  const closeAuthModal = () => setIsAuthModalOpen({ isAuthModalOpen: false });
  const openAuthModal = () => setIsAuthModalOpen({ isAuthModalOpen: true });

  return (
    <AuthContext.Provider
      value={{
        accountAddress,
        openAuthModal,
        closeAuthModal,
        switchChain,
        provider,
        signer,
        chainId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
