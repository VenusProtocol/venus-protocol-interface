import { type ReactElement, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { cn } from 'components';

export interface Tab {
  id: string;
  title: string;
  content: ReactElement;
}

export interface TabsProps {
  tabs: Tab[];
}

const TAB_PARAM_KEY = 'tab';

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabId = searchParams.get(TAB_PARAM_KEY) ?? undefined;
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const setActiveTabId = (newActiveTabId: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [TAB_PARAM_KEY]: newActiveTabId,
    }));

  useEffect(() => {
    // Add tab param to URL if none has been set
    if (!activeTabId) {
      setActiveTabId(tabs[0].id);
    }
  }, [activeTabId, setActiveTabId, tabs]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="relative">
        <div className="h-[1px] bg-lightGrey absolute bottom-0 left-0 right-0 -z-[1]" />

        <div className="flex gap-x-4 scrollbar-hidden overflow-y-auto md:overflow-y-visible sm:gap-x-6">
          {tabs.map(tab => (
            <button
              className="-mb-[1px]"
              onClick={() => setActiveTabId(tab.id)}
              type="button"
              key={tab.title}
            >
              <p
                className={cn(
                  'mb-2 font-semibold whitespace-nowrap sm:text-lg',
                  activeTabId === tab.id ? 'text-offWhite' : 'text-grey',
                )}
              >
                {tab.title}
              </p>

              <div
                className={cn(
                  'w-full h-[5px] rounded-t-[2px]',
                  activeTabId === tab.id ? 'bg-blue' : 'bg-transparent',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>{activeTab?.content}</div>
    </div>
  );
};
