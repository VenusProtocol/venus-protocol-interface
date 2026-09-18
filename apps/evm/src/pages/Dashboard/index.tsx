import { useGetLiquidityHubs, useGetPool, useGetVaults } from 'clients/api';
import { Page, SectionErrorBoundary, Spinner, Tabs } from 'components';
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

  const {
    data: getLiquidityHubsData = {
      liquidityHubs: [],
    },
    isLoading: isGetLiquidityHubsLoading,
  } = useGetLiquidityHubs({
    accountAddress,
  });
  const { liquidityHubs } = getLiquidityHubsData;

  const tabs: Tab[] = [
    {
      title: t('account.tabs.markets'),
      id: 'pools',
      content: (
        <SectionErrorBoundary className="my-10">
          {isGetPoolLoading ? <Spinner /> : pool && <Markets pool={pool} />}
        </SectionErrorBoundary>
      ),
    },
    {
      title: t('account.tabs.vaults'),
      id: 'vaults',
      content: (
        <SectionErrorBoundary className="my-10">
          {isGetVaultsLoading ? <Spinner /> : <Vaults vaults={vaults} />}
        </SectionErrorBoundary>
      ),
    },
  ];

  if (isLiquidityHubFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.hubs'),
      id: 'hub',
      content: (
        <SectionErrorBoundary className="my-10">
          {isGetLiquidityHubsLoading ? <Spinner /> : <Hubs liquidityHubs={liquidityHubs} />}
        </SectionErrorBoundary>
      ),
    });
  }

  if (isHistoricalTransactionsFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.transactions'),
      id: 'transactions',
      content: (
        <SectionErrorBoundary className="my-10">
          <Transactions />
        </SectionErrorBoundary>
      ),
    });
  }

  if (isGaslessTransactionsFeatureEnabled) {
    tabs.push({
      title: t('account.tabs.settings'),
      id: 'settings',
      content: <Settings />,
    });
  }

  return (
    <Page>
      <div className="mt-2 mb-12">
        <AdBanner />
      </div>

      <div className="space-y-12 mb-12">
        <SectionErrorBoundary>
          <AccountOverview className="w-full" accountAddress={accountAddress} />
        </SectionErrorBoundary>

        <Guide />
      </div>

      <Tabs tabs={tabs} navType="searchParam" variant="tertiary" />
    </Page>
  );
};

export default Dashboard;
