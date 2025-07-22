import { Page } from 'components';
import { useTranslation } from 'libs/translations';
import { PerformanceGraph } from './PerformanceGraph';
import { Summary } from './Summary';
import { type Tab, Tabs } from './Tabs';

export const NewPage: React.FC = () => {
  const { t } = useTranslation();

  const tabs: Tab[] = [
    {
      title: t('account.tabs.positions'),
      content: <>Positions</>,
    },
    {
      title: t('account.tabs.transactions'),
      content: <>Transactions</>, // TODO: lazy load
    },
    {
      title: t('account.tabs.port'),
      content: <>Port</>,
    },
  ];

  return (
    <Page indexWithSearchEngines={false}>
      <div className="space-y-4 mb-8">
        <PerformanceGraph />

        <Summary />
      </div>

      <Tabs tabs={tabs} />
    </Page>
  );
};
