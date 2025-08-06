import { createContext, useContext, useState } from 'react';

interface AuthAnalyticVariantContextProps {
  setAuthAnalyticVariant: (variant: string | undefined) => void;
  authAnalyticVariant?: string;
}

const AuthAnalyticVariantContext = createContext<AuthAnalyticVariantContextProps>({
  setAuthAnalyticVariant: () => {},
});

export const useAuthAnalyticVariantContext = () => useContext(AuthAnalyticVariantContext);

export const AuthAnalyticVariantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // This context is used to track from what part of the app the auth modal was opened, so that we
  // can also distinguish a new user connecting their wallet to an existing user getting their
  // wallet automatically reconnected
  const [authAnalyticVariant, setAuthAnalyticVariant] = useState<string | undefined>(undefined);

  return (
    <AuthAnalyticVariantContext.Provider value={{ authAnalyticVariant, setAuthAnalyticVariant }}>
      {children}
    </AuthAnalyticVariantContext.Provider>
  );
};
