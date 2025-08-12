import { createContext, useContext as useReactContext, useState } from 'react';

interface AnalyticIdsContextProps {
  sessionId?: string;
  distinctId?: string;
  setIds: (input: {
    sessionId: string;
    distinctId: string;
  }) => void;
}

const AnalyticIdsContext = createContext<AnalyticIdsContextProps>({
  setIds: () => {},
});

export const useAnalyticIdsContext = () => useReactContext(AnalyticIdsContext);

export const AnalyticIdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<{
    sessionId: string;
    distinctId: string;
  }>();

  return (
    <AnalyticIdsContext.Provider value={{ ...ids, setIds }}>{children}</AnalyticIdsContext.Provider>
  );
};
