import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

export interface Tab extends Record<string, any> {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const TAB_PARAM_KEY = 'tab';

export const useTabs = <T extends Tab>({ tabs }: { tabs: T[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabId = searchParams.get(TAB_PARAM_KEY) ?? undefined;
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const setActiveTab = ({ id }: { id: string }) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [TAB_PARAM_KEY]: id,
    }));

  useEffect(() => {
    // Add tab param to URL if none has been set
    if (!activeTabId) {
      setActiveTab({ id: tabs[0].id });
    }
  }, [activeTabId, setActiveTab, tabs]);

  return {
    activeTab,
    setActiveTab,
  };
};
