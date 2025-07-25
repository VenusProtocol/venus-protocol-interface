import {
  useGetPools,
  useGetTokenUsdPrice,
  useGetUserVaiBorrowBalance,
  useGetVaults,
} from 'clients/api';
import { Page, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { convertDollarsToCents } from 'utilities';
import { PerformanceGraph } from './PerformanceGraph';
import { Summary } from './Summary';
import { type Tab, Tabs } from './Tabs';

export const NewPage: React.FC = () => {
  const { t } = useTranslation();

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

  const isFetching =
    isGetPoolsLoading ||
    isGetVaultsLoading ||
    isGetXvsUsdPriceLoading ||
    isGetVaiUsdPriceLoading ||
    isGetUserVaiBorrowBalanceLoading;

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

  // Filter out pools user has not supplied in or borrowed from, unless they have assets enabled as
  // collateral in that pool
  const filteredPools = pools.filter(pool =>
    pool.assets.some(
      asset =>
        asset.userSupplyBalanceTokens.isGreaterThan(0) ||
        asset.userBorrowBalanceTokens.isGreaterThan(0) ||
        asset.isCollateralOfUser,
    ),
  );

  const tabs: Tab[] = [
    {
      title: t('account.tabs.pools'),
      content: <>Pool positions will go here</>,
    },
    {
      title: t('account.tabs.vaults'),
      content: <>Vault positions will go here</>,
    },
  ];

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page indexWithSearchEngines={false}>
      <div className="space-y-4 mb-8 lg:flex lg:space-y-0 lg:gap-x-6">
        <PerformanceGraph className="lg:basis-8/12" />

        <Summary
          className="lg:basis-4/12"
          pools={filteredPools}
          vaults={filteredVaults}
          xvsPriceCents={xvsPriceCents}
          vaiPriceCents={vaiPriceCents}
          userVaiBorrowBalanceMantissa={userVaiBorrowBalanceMantissa}
        />
      </div>

      <Tabs tabs={tabs} />
    </Page>
  );
};
