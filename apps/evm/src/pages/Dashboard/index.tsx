import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetPool, useGetVaults } from 'clients/api';
import { Page, Spinner, Tabs } from 'components';
import { AdBanner } from 'containers/AdBanner';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { AccountOverview } from '../../containers/AccountOverview';
import { Guide } from './Guide';
import { Hubs } from './Hubs';
import { Markets } from './Markets';
import { Settings } from './Settings';
import { Transactions } from './Transactions';
import { Vaults } from './Vaults';

export { liquidityHubs };

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const { chainId } = useChainId();
  const [, setSearchParams] = useSearchParams();

  const chainIdRef = useRef(chainId);
  useEffect(() => {
    if (chainId !== chainIdRef.current) {
      chainIdRef.current = chainId;
      setSearchParams(currentSearchParams => {
        currentSearchParams.delete(PAGE_PARAM_DEFAULT_KEY);
        return Object.fromEntries(currentSearchParams);
      });
    }
  }, [chainId, setSearchParams]);

  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'gaslessTransactions',
  });
  const isHistoricalTransactionsFeatureEnabled = useIsFeatureEnabled({
    name: 'transactionHistory',
  });
  const isLiquidityHubFeatureEnabled = useIsFeatureEnabled({
    name: 'liquidityHub',
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
      title: t('account.tabs.vaults'),
      id: 'vaults',
      content: <Vaults vaults={vaults} />,
    },
  ];

  if (isLiquidityHubFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.hubs'),
      id: 'hub',
      content: <Hubs liquidityHubs={liquidityHubs} />,
    });
  }

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
        <AccountOverview className="w-full" accountAddress={accountAddress} />

        <Guide />
      </div>

      <Tabs tabs={tabs} navType="searchParam" variant="tertiary" />
    </Page>
  );
};

export default Dashboard;
