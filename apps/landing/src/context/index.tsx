import { createContext, useContext as useReactContext, useState } from 'react';

interface AnalyticIds {
  distinctId: string;
  sessionId: string;
}

interface AppStateContextProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  setAnalyticIds: (input: AnalyticIds) => void;
  analyticIds?: AnalyticIds;
}

const AppStateContext = createContext<AppStateContextProps>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
  setAnalyticIds: () => {},
});

export const useAppStateContext = () => useReactContext(AppStateContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analyticIds, setAnalyticIds] = useState<AnalyticIds>();

  return (
    <AppStateContext.Provider
      value={{ analyticIds, setAnalyticIds, isMobileMenuOpen, setIsMobileMenuOpen }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const AppStateConsumer = AppStateContext.Consumer;
