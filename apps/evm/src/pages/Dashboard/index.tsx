import { useGetLiquidityHubs, useGetPool, useGetSpokePools, useGetVaults } from 'clients/api';
import { Page, SectionErrorBoundary, Spinner, Tabs } from 'components';
import { AdBanner } from 'containers/AdBanner';
import { useChain } from 'hooks/useChain';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
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
import { LitePositions } from './LitePositions';
import { Markets } from './Markets';
import { Settings } from './Settings';
import { Transactions } from './Transactions';
import { Vaults } from './Vaults';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { isLite } = useInterfaceMode();
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
  } = useGetLiquidityHubs(
    {
      accountAddress,
    },
    {
      enabled: isLiquidityHubFeatureEnabled,
    },
  );
  const { liquidityHubs } = getLiquidityHubsData;

  const { isLoading: isGetSpokePoolsLoading, errorUpdateCount: getSpokePoolsErrorCount } =
    useGetSpokePools({ accountAddress }, { enabled: !!accountAddress });

  const tabs: Tab[] = [
    {
      title: t('account.tabs.markets'),
      id: 'pools',
      content: (
        <SectionErrorBoundary className="my-10" key="pools">
          {isGetPoolLoading || (isGetSpokePoolsLoading && getSpokePoolsErrorCount === 0) ? (
            <Spinner />
          ) : (
            pool && <Markets pool={pool} />
          )}
        </SectionErrorBoundary>
      ),
    },
    {
      title: t('account.tabs.vaults'),
      id: 'vaults',
      content: (
        <SectionErrorBoundary className="my-10" key="vaults">
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
        <SectionErrorBoundary className="my-10" key="hub">
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
        <SectionErrorBoundary className="my-10" key="transactions">
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

  if (isLite) {
    return (
      <Page>
        <div className="mb-6 space-y-6">
          <SectionErrorBoundary>
            <AccountOverview className="w-full" accountAddress={accountAddress} />
          </SectionErrorBoundary>

          <Guide />
        </div>

        <SectionErrorBoundary className="my-10">
          <LitePositions
            pool={pool}
            liquidityHubs={liquidityHubs}
            vaults={vaults}
            isHubsLoading={isGetLiquidityHubsLoading}
            isVaultsLoading={isGetVaultsLoading}
          />
        </SectionErrorBoundary>

        {isHistoricalTransactionsFeatureEnabled && (
          <section
            aria-label={t('account.tabs.transactions')}
            className="mt-12 flex flex-col gap-6"
          >
            <h2 className="text-p1s">{t('account.tabs.transactions')}</h2>

            <SectionErrorBoundary>
              <Transactions />
            </SectionErrorBoundary>
          </section>
        )}
      </Page>
    );
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
