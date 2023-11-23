import { useAccountAddress, useChainId } from 'packages/wallet';
import { store } from 'packages/wallet/store';
import React, { useContext } from 'react';
import { ChainId } from 'types';

export interface AuthContextValue {
  chainId: ChainId;
  accountAddress?: string;
}

export const AuthContext = React.createContext<AuthContextValue>({
  chainId: store.getState().chainId,
});

export interface AuthProviderProps {
  children?: React.ReactNode;
}

// TODO: remove in favor of using hooks from wallet package separately (see VEN-2143)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return (
    <AuthContext.Provider
      value={{
        accountAddress,
        chainId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
