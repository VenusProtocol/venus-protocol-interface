import { createContext, useContext as useReactContext, useState } from 'react';

interface AppStateContextProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const AppStateContext = createContext<AppStateContextProps>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
});

export const useAppStateContext = () => useReactContext(AppStateContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AppStateContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const AppStateConsumer = AppStateContext.Consumer;
