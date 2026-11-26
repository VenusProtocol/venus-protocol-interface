import { createContext } from 'react';

export const TabsDepthContext = createContext(0);

export const ReportActiveTabContext = createContext<
  ((input: { depth: number; tabId?: string }) => void) | undefined
>(undefined);

export const ActiveTabPathContext = createContext<string[]>([]);
