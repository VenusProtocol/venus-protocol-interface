/** @jsxImportSource @emotion/react */
import { Spinner } from 'components';
import React, { useContext, useMemo } from 'react';
import { Asset, Pool } from 'types';

import { useGetPools } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import PoolBreakdown from './PoolBreakdown';
import Summary from './Summary';
import { useStyles } from './styles';

export interface AccountUiProps {
  pools: Pool[];
  isFetchingPools: boolean;
  netApyPercentage?: number;
  dailyEarningsCents?: number;
  totalSupplyCents?: number;
  totalBorrowCents?: number;
}

export const AccountUi: React.FC<AccountUiProps> = ({ isFetchingPools, pools }) => {
  const styles = useStyles();

  // Filter out pools user has not supplied in or borrowed from
  const filteredPools = useMemo(
    () =>
      pools.filter(
        pool =>
          !!pool.assets.find(
            asset => asset.userSupplyBalanceCents > 0 || asset.userBorrowBalanceCents > 0,
          ),
      ),
    [pools],
  );

  const allAssets = useMemo(
    () => pools.reduce((acc, pool) => [...acc, ...pool.assets], [] as Asset[]),
    [pools],
  );

  if (isFetchingPools) {
    return <Spinner />;
  }

  return (
    <>
      <Summary css={styles.section} assets={allAssets} />

      {filteredPools.map(pool => (
        <PoolBreakdown key={`pool-breakdown-${pool.name}`} css={styles.section} pool={pool} />
      ))}
    </>
  );
};

const Account: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress: account?.address,
  });

  return <AccountUi isFetchingPools={isGetPoolsLoading} pools={getPoolsData?.pools || []} />;
};

export default Account;
