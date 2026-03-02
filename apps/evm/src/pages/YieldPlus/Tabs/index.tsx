import { Tabs as TabsComp } from 'components';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { Positions } from './Positions';

export const Tabs: React.FC = () => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    { id: 'positions', title: t('yieldPlus.tabs.positions.label'), content: <Positions /> },
    {
      id: 'transactions',
      title: t('yieldPlus.tabs.transactions.label'),
      content: <>TODO: add content</>,
    },
  ];

  return <TabsComp tabs={tabs} variant="secondary" />;
};
