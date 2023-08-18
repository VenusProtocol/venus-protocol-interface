/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Spinner } from 'components';
import React, { useMemo } from 'react';
import { Pool, Vault } from 'types';
import { areTokensEqual } from 'utilities';

import { useGetPools, useGetVaults } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import AccountPlaceholder from './AccountPlaceholder';
import PoolsBreakdown from './PoolsBreakdown';
import Summary from './Summary';
import VaultsBreakdown from './VaultsBreakdown';
import { useStyles } from './styles';

export interface AccountUiProps {
  pools: Pool[];
  vaults: Vault[];
  isFetching?: boolean;
}

// We assume 1 VAI = 1 dollar
const VAI_PRICE_CENTS = new BigNumber(100);

export const AccountUi: React.FC<AccountUiProps> = ({ isFetching, vaults, pools }) => {
  const styles = useStyles();

  // Filter out vaults user has not staked in
  const filteredVaults = useMemo(
    () => vaults.filter(vault => vault.userStakedWei?.isGreaterThan(0)),
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
        if (areTokensEqual(asset.vToken.underlyingToken, TOKENS.xvs)) {
          priceCents = asset.tokenPriceCents;
          return false;
        }

        return true;
      }),
    );

    return priceCents;
  }, [pools]);

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

const Account: React.FC = () => {
  const { accountAddress } = useAuth();
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  const isFetching = isGetPoolsLoading || isGetVaultsLoading;

  return (
    <AccountUi
      isFetching={isFetching}
      pools={getPoolsData?.pools || []}
      vaults={getVaultsData || []}
    />
  );
};

export default Account;
