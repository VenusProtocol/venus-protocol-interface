import { cn } from '@venusprotocol/ui';

import { ButtonGroup } from 'components';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { Borrow } from './Borrow';
import { Supply } from './Supply';

export interface TabsProps {
  pool: Pool;
}

const cardClassName = cn(
  'flex items-center justify-between p-3',
  'rounded-lg bg-[rgba(24,29,42,0.1)] shadow-[0_-1px_1px_0_#21293A_inset,0_1px_1px_0_rgba(255,255,255,0.25)_inset] backdrop-blur-xs',
);

export const HeroTabs: React.FC<TabsProps> = () => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      title: t('landing.hero.supply'),
      id: 'supply',
      content: <Supply />,
    },
    {
      title: t('landing.hero.borrow'),
      id: 'borrow',
      content: <Borrow />,
    },
  ];

  const { activeTab, setActiveTab } = useTabs({
    tabs,
  });

  const handleChange = (index: number) => {
    const id = tabs[index].id;
    setActiveTab({ id });
  };

  return (
    <div className={cn('flex flex-col w-full gap-3 sm:max-w-135.75')}>
      <div className={cardClassName}>
        <ButtonGroup
          buttonLabels={tabs.map(({ title }) => title)}
          activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
          onButtonClick={handleChange}
          fullWidth
          className="bg-dark-blue-disabled/50"
          btnClassName="h-12 m-0!"
          activeClassName="bg-blue hover:bg-blue-hover!"
        />
      </div>

      <div className={cn(cardClassName, 'p-6')}>{activeTab.content}</div>
    </div>
  );
};
