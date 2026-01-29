import { useGetPools, useGetTokenUsdPrice, useGetVaults } from 'clients/api';
import { Page, Spinner, Tabs } from 'components';
import { Redirect } from 'containers/Redirect';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { convertDollarsToCents } from 'utilities';
import { PerformanceChart } from './PerformanceChart';
import { Pools } from './Pools';
import { PrimeBanner } from './PrimeBanner';
import { Settings } from './Settings';
import { Summary } from './Summary';
import { Transactions } from './Transactions';
import { Vaults } from './Vaults';
import { useExtractData } from './useExtractData';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const isPrimeFeatureEnabled = useIsFeatureEnabled({
    name: 'prime',
  });
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

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { data: getXvsUsdPriceData, isLoading: isGetXvsUsdPriceLoading } = useGetTokenUsdPrice({
    token: xvs,
  });
  const xvsPriceCents =
    getXvsUsdPriceData && convertDollarsToCents(getXvsUsdPriceData.tokenPriceUsd);

  const vai = useGetToken({
    symbol: 'VAI',
  });
  const { data: getVaiUsdPriceData, isLoading: isGetVaiUsdPriceLoading } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceCents =
    getVaiUsdPriceData && convertDollarsToCents(getVaiUsdPriceData.tokenPriceUsd);

  const {
    isLoading: isGetUserPrimeInfoLoading,
    data: {
      isUserPrime,
      userHighestPrimeSimulationApyBoostPercentage: primeBoostPercentage,
      primeTokenLimit,
      claimedPrimeTokenCount,
      userClaimTimeRemainingSeconds,
      userStakedXvsTokens,
      minXvsToStakeForPrimeTokens,
    },
  } = useGetUserPrimeInfo({ accountAddress });

  const { totalSupplyCents, totalBorrowCents, totalVaultStakeCents, totalVaiBorrowBalanceCents } =
    useExtractData({
      pools,
      vaults,
      xvsPriceCents,
      vaiPriceCents,
    });

  const canUserBecomePrime =
    // Check there's Prime tokens left to claim
    typeof primeTokenLimit === 'number' &&
    typeof claimedPrimeTokenCount === 'number' &&
    primeTokenLimit - claimedPrimeTokenCount > 0 &&
    // Check user is staking enough XVS
    userStakedXvsTokens.isGreaterThanOrEqualTo(minXvsToStakeForPrimeTokens) &&
    // Check users has staked XVS for long enough
    typeof userClaimTimeRemainingSeconds === 'number' &&
    userClaimTimeRemainingSeconds <= 0;

  const tabs: Tab[] = [
    {
      title: t('account.tabs.pools'),
      id: 'pools',
      content: <Pools pools={pools} />,
    },
    {
      title: t('account.tabs.vaults'),
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

  const netWorthCents = totalSupplyCents
    .plus(totalVaultStakeCents || 0)
    .minus(totalBorrowCents)
    .minus(totalVaiBorrowBalanceCents || 0)
    .toNumber();

  const isFetching =
    isGetPoolsLoading ||
    isGetVaultsLoading ||
    isGetXvsUsdPriceLoading ||
    isGetVaiUsdPriceLoading ||
    isGetUserPrimeInfoLoading;

  if (!accountAddress) {
    return <Redirect to={marketsPagePath} />;
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page>
      {isPrimeFeatureEnabled && !isUserPrime && primeBoostPercentage && (
        <PrimeBanner
          className="mb-4 lg:mb-6"
          canUserBecomePrime={canUserBecomePrime}
          boostPercentage={primeBoostPercentage}
        />
      )}

      <div className="space-y-4 mb-8 lg:flex lg:space-y-0 lg:gap-x-6">
        <PerformanceChart className="lg:basis-8/12" netWorthCents={netWorthCents} />

        <Summary
          className="lg:basis-4/12"
          pools={pools}
          vaults={vaults}
          xvsPriceCents={xvsPriceCents}
          vaiPriceCents={vaiPriceCents}
        />
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
