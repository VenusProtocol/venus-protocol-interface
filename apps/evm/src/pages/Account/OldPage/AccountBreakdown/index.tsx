import { useMemo } from 'react';

import { useGetPools, useGetTokenUsdPrice, useGetVaults } from 'clients/api';
import { Spinner } from 'components';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';

import BigNumber from 'bignumber.js';
import { useConvertDollarsToCents } from 'hooks/useConvertDollarsToCents';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { Settings } from 'pages/Account/Settings';
import AccountPlaceholder from '../../AccountPlaceholder';
import { PoolPositions } from '../../PoolPositions';
import { PoolSummary } from '../../PoolSummary';
import { Section } from '../../Section';
import VaultsBreakdown from '../../VaultsBreakdown';

const Account: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isGaslessTransactionsFeatureEnabled = useIsFeatureEnabled({ name: 'gaslessTransactions' });
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
  const xvsPriceCents = useConvertDollarsToCents({
    value: getXvsUsdPriceData?.tokenPriceUsd || new BigNumber(0),
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });
  const { data: getVaiUsdPriceData, isLoading: isGetVaiUsdPriceLoading } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceCents = useConvertDollarsToCents({
    value: getVaiUsdPriceData?.tokenPriceUsd || new BigNumber(0),
  });

  const isFetching =
    isGetPoolsLoading || isGetVaultsLoading || isGetXvsUsdPriceLoading || isGetVaiUsdPriceLoading;

  // Filter out vaults user has not staked in
  const filteredVaults = useMemo(
    () => vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0)),
    [vaults],
  );

  // Filter out pools user has not supplied in or borrowed from, unless they have assets enabled as
  // collateral in that pool
  const filteredPools = useMemo(
    () =>
      pools.filter(pool =>
        pool.assets.some(
          asset =>
            asset.userSupplyBalanceTokens.isGreaterThan(0) ||
            asset.userBorrowBalanceTokens.isGreaterThan(0) ||
            asset.isCollateralOfUser,
        ),
      ),
    [pools],
  );

  if (isFetching) {
    return <Spinner />;
  }

  const hasPositions = filteredPools.length > 0 || filteredVaults.length > 0;

  if (!hasPositions) {
    return <AccountPlaceholder />;
  }

  return (
    <div className="flex-auto space-y-10">
      {isGaslessTransactionsFeatureEnabled && (
        <Section title={t('account.settings.title')}>
          <Settings />
        </Section>
      )}

      <PoolSummary
        title={t('account.summary.title')}
        pools={filteredPools}
        vaults={filteredVaults}
        xvsPriceCents={xvsPriceCents}
        vaiPriceCents={vaiPriceCents}
      />

      {filteredVaults.length > 0 && <VaultsBreakdown vaults={filteredVaults} />}

      {filteredPools.length > 0 && (
        <Section title={t('account.poolsBreakdown.title')}>
          <PoolPositions pools={filteredPools} />
        </Section>
      )}
    </div>
  );
};

export default Account;
