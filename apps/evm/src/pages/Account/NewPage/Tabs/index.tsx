import { cn } from 'components';
import { type Tab, useTabs } from 'hooks/useTabs';

export interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const { activeTab, setActiveTab } = useTabs({
    tabs,
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="relative">
        <div className="h-[1px] bg-lightGrey absolute bottom-0 left-0 right-0 -z-[1]" />

        <div className="flex gap-x-4 scrollbar-hidden overflow-y-auto md:overflow-y-visible sm:gap-x-6">
          {tabs.map(tab => (
            <button onClick={() => setActiveTab({ id: tab.id })} type="button" key={tab.title}>
              <p
                className={cn(
                  'mb-2 font-semibold whitespace-nowrap sm:text-lg',
                  activeTab.id === tab.id ? 'text-offWhite' : 'text-grey',
                )}
              >
                {tab.title}
              </p>

              <div
                className={cn(
                  'w-full h-[5px] rounded-t-[2px]',
                  activeTab.id === tab.id ? 'bg-blue' : 'bg-transparent',
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
