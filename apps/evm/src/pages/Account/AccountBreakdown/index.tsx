/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetPools, useGetVaults } from 'clients/api';
import { Spinner } from 'components';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areTokensEqual } from 'utilities';

import { useStyles } from '../styles';
import AccountPlaceholder from './AccountPlaceholder';
import PoolsBreakdown from './PoolsBreakdown';
import Summary from './Summary';
import VaultsBreakdown from './VaultsBreakdown';

// We assume the price of VAI to be $1
const VAI_PRICE_CENTS = new BigNumber(100);

const Account: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  const isFetching = isGetPoolsLoading || isGetVaultsLoading;

  const pools = getPoolsData?.pools || [];
  const vaults = getVaultsData || [];

  const styles = useStyles();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

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

  const xvsPriceCents = useMemo(() => {
    let priceCents = new BigNumber(0);

    pools.forEach(pool =>
      pool.assets.every(asset => {
        if (xvs && areTokensEqual(asset.vToken.underlyingToken, xvs)) {
          priceCents = asset.tokenPriceCents;
          return false;
        }

        return true;
      }),
    );

    return priceCents;
  }, [pools, xvs]);

  if (isFetching) {
    return <Spinner />;
  }

  const hasPositions = filteredPools.length > 0 || filteredVaults.length > 0;

  if (!hasPositions) {
    return <AccountPlaceholder />;
  }

  return (
    <>
      <Summary
        css={styles.section}
        pools={filteredPools}
        vaults={filteredVaults}
        xvsPriceCents={xvsPriceCents}
        vaiPriceCents={VAI_PRICE_CENTS}
        displayTotalVaultStake
      />

      {filteredVaults.length > 0 && (
        <VaultsBreakdown css={styles.section} vaults={filteredVaults} />
      )}

      {filteredPools.length > 0 && <PoolsBreakdown css={styles.section} pools={filteredPools} />}
    </>
  );
};

export default Account;
