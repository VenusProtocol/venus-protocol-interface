import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export type TabNavType = 'searchParam' | 'state';

export interface UseTabsInput<T extends Tab> {
  tabs: T[];
  navType?: TabNavType;
  initialActiveTabId?: string;
}

export interface Tab extends Record<string, any> {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const TAB_PARAM_KEY = 'tab';

export const useTabs = <T extends Tab>({
  tabs,
  navType = 'state',
  initialActiveTabId,
}: UseTabsInput<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stateActiveTabId, setStateActiveTabId] = useState(initialActiveTabId ?? tabs[0].id);

  const activeTabId = navType === 'state' ? stateActiveTabId : searchParams.get(TAB_PARAM_KEY);
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const setActiveTab = ({ id }: { id: string }) => {
    if (navType === 'state') {
      setStateActiveTabId(id);
    } else {
      setSearchParams(currentSearchParams => ({
        ...Object.fromEntries(currentSearchParams),
        [TAB_PARAM_KEY]: id,
      }));
    }
  };

  useEffect(() => {
    // Set tab param to URL if none has been set or if it's invalid
    if (!activeTabId || !tabs.find(tab => tab.id === activeTabId)) {
      setActiveTab({ id: initialActiveTabId ?? tabs[0].id });
    }
  }, [activeTabId, setActiveTab, tabs, initialActiveTabId]);

  return {
    activeTab,
    setActiveTab,
  };
};
