import { useGetLiquidityHubs, useGetPool, useGetVaults } from 'clients/api';
import { Delimiter, Page, SectionErrorBoundary } from 'components';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { AccountOverview } from '../../containers/AccountOverview';
import { PoolPositions } from './PoolPositions';
import { Settings } from './Settings';
import { Transactions } from './Transactions';

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

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

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

  return (
    <Page>
      <div className="flex flex-col gap-6">
        <section
          aria-label={t('dashboard.overview.summary.title')}
          className="flex flex-col gap-3 sm:gap-6"
        >
          <h2 className="text-p1s">{t('dashboard.overview.summary.title')}</h2>

          <SectionErrorBoundary>
            <AccountOverview className="w-full" accountAddress={accountAddress} splitLayout />
          </SectionErrorBoundary>
        </section>

        <Delimiter className="hidden sm:my-6 sm:block" />

        <SectionErrorBoundary>
          <PoolPositions
            pool={getPoolData?.pool}
            liquidityHubs={getLiquidityHubsData.liquidityHubs}
            vaults={getVaultsData || []}
            isPoolLoading={isGetPoolLoading}
            isHubsLoading={isGetLiquidityHubsLoading}
            isVaultsLoading={isGetVaultsLoading}
          />
        </SectionErrorBoundary>

        {isHistoricalTransactionsFeatureEnabled && (
          <>
            <Delimiter className="hidden sm:my-6 sm:block" />

            <SectionErrorBoundary>
              <Transactions />
            </SectionErrorBoundary>
          </>
        )}

        {isGaslessTransactionsFeatureEnabled && (
          <section aria-label={t('account.tabs.settings')} className="mt-6 flex flex-col gap-6">
            <h2 className="text-p1s">{t('account.tabs.settings')}</h2>

            <Settings />
          </section>
        )}
      </div>
    </Page>
  );
};

export default Dashboard;
