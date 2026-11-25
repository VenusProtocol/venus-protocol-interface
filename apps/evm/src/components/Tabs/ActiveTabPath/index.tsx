import { createContext, useCallback, useContext, useState } from 'react';

export const TabsDepthContext = createContext(0);

const ReportActiveTabContext = createContext<
  ((input: { depth: number; tabId?: string }) => void) | undefined
>(undefined);

const ActiveTabPathContext = createContext<string[]>([]);

export const ActiveTabPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTabPath, setActiveTabPath] = useState<string[]>([]);

  const reportActiveTab = useCallback(
    ({ depth, tabId }: { depth: number; tabId?: string }) =>
      setActiveTabPath(currentPath => {
        if (currentPath[depth] === tabId) {
          return currentPath;
        }

        const newPath = [...currentPath];
        newPath[depth] = tabId as string;

        return tabId ? newPath : newPath.slice(0, depth);
      }),
    [],
  );

  return (
    <ReportActiveTabContext.Provider value={reportActiveTab}>
      <ActiveTabPathContext.Provider value={activeTabPath}>
        {children}
      </ActiveTabPathContext.Provider>
    </ReportActiveTabContext.Provider>
  );
};

export const useReportActiveTab = () => useContext(ReportActiveTabContext);

export const useActiveTabPath = () => useContext(ActiveTabPathContext);
