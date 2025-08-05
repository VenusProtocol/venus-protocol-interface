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
import { PerformanceChart } from './PerformanceChart';
import { Pools } from './Pools';
import { Summary } from './Summary';
import { type Tab, Tabs } from './Tabs';
import { Vaults } from './Vaults';

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

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Page indexWithSearchEngines={false}>
      <div className="space-y-4 mb-8 lg:flex lg:space-y-0 lg:gap-x-6">
        <PerformanceChart className="lg:basis-8/12" />

        <Summary
          className="lg:basis-4/12"
          pools={pools}
          vaults={vaults}
          xvsPriceCents={xvsPriceCents}
          vaiPriceCents={vaiPriceCents}
          userVaiBorrowBalanceMantissa={userVaiBorrowBalanceMantissa}
        />
      </div>

      <Tabs tabs={tabs} />
    </Page>
  );
};
