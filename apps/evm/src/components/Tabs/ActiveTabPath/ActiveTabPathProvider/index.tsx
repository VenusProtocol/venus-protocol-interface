import { useCallback, useState } from 'react';

import { ActiveTabPathContext, ReportActiveTabContext } from '../context';

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
