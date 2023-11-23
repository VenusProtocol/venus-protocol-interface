import noop from 'noop-ts';
import { useAccountAddress, useChainId, useSwitchChain } from 'packages/wallet';
import { store } from 'packages/wallet/store';
import React, { useContext } from 'react';
import { ChainId } from 'types';

export interface AuthContextValue {
  switchChain: (input: { chainId: ChainId }) => void;
  chainId: ChainId;
  accountAddress?: string;
}

export const AuthContext = React.createContext<AuthContextValue>({
  switchChain: noop,
  chainId: store.getState().chainId,
});

export interface AuthProviderProps {
  children?: React.ReactNode;
}

// TODO: remove in favor of using hooks from wallet package separately (see VEN-2143)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const switchChain = useSwitchChain();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return (
    <AuthContext.Provider
      value={{
        accountAddress,
        switchChain,
        chainId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
