import { useGetLiquidityHubs, useGetPool, useGetVaults } from 'clients/api';
import { Page, SectionErrorBoundary } from 'components';
import { AdBanner } from 'containers/AdBanner';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { AccountOverview } from '../../containers/AccountOverview';
import { Guide } from './Guide';
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
      <div className="mt-2 mb-12">
        <AdBanner />
      </div>

      <div className="mb-6 space-y-6">
        <SectionErrorBoundary>
          <AccountOverview className="w-full" accountAddress={accountAddress} splitLayout />
        </SectionErrorBoundary>

        <Guide />
      </div>

      <SectionErrorBoundary className="my-10">
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
        <section aria-label={t('account.tabs.transactions')} className="mt-12 flex flex-col gap-6">
          <h2 className="text-p1s">{t('account.tabs.transactions')}</h2>

          <SectionErrorBoundary>
            <Transactions />
          </SectionErrorBoundary>
        </section>
      )}

      {isGaslessTransactionsFeatureEnabled && (
        <section aria-label={t('account.tabs.settings')} className="mt-12 flex flex-col gap-6">
          <h2 className="text-p1s">{t('account.tabs.settings')}</h2>

          <Settings />
        </section>
      )}
    </Page>
  );
};

export default Dashboard;
