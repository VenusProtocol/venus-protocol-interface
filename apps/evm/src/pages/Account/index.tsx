import {
  useGetPools,
  useGetTokenUsdPrice,
  useGetUserVaiBorrowBalance,
  useGetVaiRepayApr,
  useGetVaults,
} from 'clients/api';
import { Page, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Redirect } from 'containers/Redirect';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
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
import { Tabs } from './Tabs';
import { Vaults } from './Vaults';
import { useExtractData } from './useExtractData';

export const Account: React.FC = () => {
  const { t } = useTranslation();

  const isPrimeFeatureEnabled = useIsFeatureEnabled({
    name: 'prime',
  });
  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({ name: 'gaslessTransactions' });

  const { homePagePath } = useGetHomePagePath();

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

  const { data: getVaiRepayAprData } = useGetVaiRepayApr();
  const vaiBorrowAprPercentage = getVaiRepayAprData?.repayAprPercentage;

  const { data: getUserVaiBorrowBalanceData, isLoading: isGetUserVaiBorrowBalanceLoading } =
    useGetUserVaiBorrowBalance(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );
  const userVaiBorrowBalanceMantissa = getUserVaiBorrowBalanceData?.userVaiBorrowBalanceMantissa;

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
      vai,
      userVaiBorrowBalanceMantissa,
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
    isGetUserVaiBorrowBalanceLoading ||
    isGetUserPrimeInfoLoading;

  if (!accountAddress) {
    return <Redirect to={homePagePath} />;
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page indexWithSearchEngines={false}>
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
          vaiBorrowAprPercentage={vaiBorrowAprPercentage}
          userVaiBorrowBalanceMantissa={userVaiBorrowBalanceMantissa}
        />
      </div>

      <Tabs tabs={tabs} />
    </Page>
  );
};

export default Account;
