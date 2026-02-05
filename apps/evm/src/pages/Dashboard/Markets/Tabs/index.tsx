import { ButtonGroup } from 'components';
import { type Tab, useTabs } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import { EModeButton } from './EModeButton';
import { TabContent } from './TabContent';

export interface TabsProps {
  pool: Pool;
}

export const Tabs: React.FC<TabsProps> = ({ pool }) => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      id: 'supplied',
      title: t('dashboard.markets.suppliedTabTitle'),
      content: <TabContent type="supply" pool={pool} />,
    },
    {
      id: 'borrowed',
      title: t('dashboard.markets.borrowTabTitle'),
      content: <TabContent type="borrow" pool={pool} />,
    },
  ];

  const { activeTab, setActiveTab } = useTabs({
    tabs,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-y-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-x-3">
          <p className="text-p2s">{t('dashboard.markets.title')}</p>

          {pool?.userEModeGroup && <EModeButton eModeGroupName={pool.userEModeGroup.name} />}
        </div>

        <ButtonGroup
          buttonLabels={tabs.map(({ title }) => title)}
          activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
          onButtonClick={index => setActiveTab(tabs[index])}
          buttonClassName="md:px-12"
        />
      </div>

      {activeTab.content}
    </div>
  );
};
