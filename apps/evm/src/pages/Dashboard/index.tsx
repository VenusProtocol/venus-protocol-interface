import { AdCarousel, Page, Tabs } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { Guide } from './Guide';
import { Markets } from './Markets';
import { Overview } from './Overview';
import { Staking } from './Staking';
import { TopMarkets } from './TopMarkets';
import { Transactions } from './Transactions';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const isHistoricalTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'transactionHistory',
  });

  const tabs: Tab[] = [
    {
      title: t('dashboard.tabs.markets'),
      id: 'markets',
      content: <Markets />,
    },
    {
      title: t('dashboard.tabs.staking'),
      id: 'staking',
      content: <Staking />,
    },
  ];

  if (isHistoricalTransactionsFeatureEnabled) {
    tabs.push({
      title: t('dashboard.tabs.transactions'),
      id: 'transactions',
      content: <Transactions />,
    });
  }

  return (
    <Page>
      <div className="space-y-12 xl:grid xl:grid-cols-[8fr_4fr] xl:gap-x-6">
        <div className="space-y-6 xl:order-2">
          <AdCarousel />

          <TopMarkets />
        </div>

        <div className="space-y-12 xl:order-1">
          <div className="space-y-6 sm:space-y-12">
            <Overview />

            <Guide />
          </div>

          <Tabs
            tabs={tabs}
            headerClassName="text-md md:text-lg"
            navType="searchParam"
            variant="secondary"
          />
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
