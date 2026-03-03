import { useGetPools, useGetVaults } from 'clients/api';
import { Page, Spinner, Tabs } from 'components';
import { AdBanner } from 'containers/AdBanner';
import { Redirect } from 'containers/Redirect';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Guide } from './Guide';
import { Overview } from './Overview';
import { Pools } from './Pools';
import { Settings } from './Settings';
import { Transactions } from './Transactions';
import { Vaults } from './Vaults';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'gaslessTransactions',
  });
  const isHistoricalTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'transactionHistory',
  });

  const { marketsPagePath } = useGetMarketsPagePath();

  const { accountAddress } = useAccountAddress();
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });
  const pools = getPoolsData?.pools || [];

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });
  const vaults = getVaultsData || [];

  const tabs: Tab[] = [
    {
      title: t('account.tabs.markets'),
      id: 'pools',
      content: <Pools pools={pools} />,
    },
    {
      title: t('account.tabs.staking'),
      id: 'vaults',
      content: <Vaults vaults={vaults} />,
    },
  ];

  if (isHistoricalTransactionsFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.transactions'),
      id: 'transactions',
      content: <Transactions />,
    });
  }

  if (isGaslessTransactionsFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.settings'),
      id: 'settings',
      content: <Settings />,
    });
  }

  const isFetching = isGetPoolsLoading || isGetVaultsLoading;

  if (!accountAddress) {
    return <Redirect to={marketsPagePath} />;
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page>
      <div className="mt-2 mb-12">
        <AdBanner />
      </div>

      <div className="space-y-12 mb-12 lg:flex lg:space-y-0 lg:gap-x-6">
        <Overview className="w-full" />

        <Guide />
      </div>

      <Tabs
        tabs={tabs}
        className="lg:space-y-8"
        headerClassName="text-md sm:text-lg"
        navType="searchParam"
        variant="secondary"
      />
    </Page>
  );
};

export default Dashboard;
