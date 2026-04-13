import { cn } from '@venusprotocol/ui';
import { Delimiter } from 'components';
import { type Tab, type TabNavType, useTabs } from 'hooks/useTabs';
import { ButtonGroup } from '../ButtonGroup';

export interface TabsProps {
  tabs: Tab[];
  variant?: 'primary' | 'secondary' | 'tertiary';
  onTabChange?: (newIndex: number) => void;
  navType?: TabNavType;
  initialActiveTabId?: string;
  className?: string;
  headerClassName?: string;
  buttonClassName?: string;
}

export const Tabs = ({
  tabs,
  variant = 'primary',
  onTabChange,
  initialActiveTabId,
  className,
  headerClassName,
  buttonClassName,
  navType = 'state',
}: TabsProps) => {
  const { activeTab, setActiveTab } = useTabs({
    tabs,
    navType,
    initialActiveTabId,
  });

  const handleChange = (index: number) => {
    const id = tabs[index].id;
    setActiveTab({ id });

    // Only call onTabChange callback if tab clicked isn't currently active
    if (id !== activeTab.id && onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {variant === 'primary' ? (
        <ButtonGroup
          buttonLabels={tabs.map(({ title }) => title)}
          className={headerClassName}
          buttonClassName={cn('px-2', buttonClassName)}
          activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
          onButtonClick={handleChange}
          fullWidth
        />
      ) : (
        <div className="relative">
          <div
            className={cn(
              'flex text-sm gap-x-4 scrollbar-hidden overflow-y-auto sm:gap-x-6 md:overflow-y-visible',
              variant === 'tertiary' && 'text-md sm:text-lg',
              headerClassName,
            )}
          >
            {tabs.map((tab, index) => (
              <button
                onClick={() => handleChange(index)}
                type="button"
                key={tab.id}
                className={cn(
                  'hover:text-white cursor-pointer',
                  variant === 'secondary' && 'grow',
                  activeTab.id === tab.id ? 'text-white' : 'text-grey',
                  buttonClassName,
                )}
              >
                <p
                  className={cn(
                    'mb-2 font-semibold whitespace-nowrap transition-colors text-inherit',
                    variant === 'secondary' && 'text-center',
                  )}
                >
                  {tab.title}
                </p>

                <div
                  className={cn(
                    'w-full h-[3px] rounded-t-[2px]',
                    activeTab.id === tab.id ? 'bg-blue' : 'bg-transparent',
                  )}
                />
              </button>
            ))}
          </div>

          <Delimiter className="-mt-px -z-1" />
        </div>
      )}

      <div>{activeTab.content}</div>
    </div>
  );
};
