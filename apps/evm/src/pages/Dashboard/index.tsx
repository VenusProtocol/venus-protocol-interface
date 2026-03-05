import { useGetPool, useGetVaults } from 'clients/api';
import { Page, Spinner, Tabs } from 'components';
import { AdBanner } from 'containers/AdBanner';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Guide } from './Guide';
import { Markets } from './Markets';
import { Overview } from './Overview';
import { Settings } from './Settings';
import { Transactions } from './Transactions';
import { Vaults } from './Vaults';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();

  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'gaslessTransactions',
  });
  const isHistoricalTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'transactionHistory',
  });

  const { accountAddress } = useAccountAddress();
  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });
  const vaults = getVaultsData || [];

  const tabs: Tab[] = [
    {
      title: t('account.tabs.markets'),
      id: 'pools',
      content: pool && <Markets pool={pool} />,
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

  const isFetching = isGetPoolLoading || isGetVaultsLoading;

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page>
      <div className="mt-2 mb-12">
        <AdBanner />
      </div>

      <div className="space-y-12 mb-12">
        <Overview className="w-full" />

        <Guide />
      </div>

      <Tabs
        tabs={tabs}
        headerClassName="text-md sm:text-lg"
        navType="searchParam"
        variant="secondary"
      />
    </Page>
  );
};

export default Dashboard;
