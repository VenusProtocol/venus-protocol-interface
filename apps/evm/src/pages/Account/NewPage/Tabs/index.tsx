import { type ReactElement, useState } from 'react';

import { cn } from 'components';

export interface Tab {
  title: string;
  content: ReactElement;
}

export interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="h-[1px] bg-lightGrey absolute bottom-0 left-0 right-0 -z-[1]" />

        <div className="flex gap-x-4 scrollbar-hidden overflow-y-auto md:overflow-y-visible">
          {tabs.map((tab, tabIndex) => (
            <button
              className="-mb-[1px]"
              onClick={() => setActiveTabIndex(tabIndex)}
              type="button"
              key={tab.title}
            >
              <p
                className={cn(
                  'mb-2 font-semibold whitespace-nowrap',
                  tabIndex === activeTabIndex ? 'text-offWhite' : 'text-grey',
                )}
              >
                {tab.title}
              </p>

              <div
                className={cn(
                  'w-full h-[5px] rounded-t-[2px]',
                  tabIndex === activeTabIndex ? 'bg-blue' : 'bg-transparent',
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>{tabs[activeTabIndex].content}</div>
    </div>
  );
};
