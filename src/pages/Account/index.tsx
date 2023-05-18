/** @jsxImportSource @emotion/react */
import { Spinner } from 'components';
import React, { useMemo } from 'react';
import { Pool } from 'types';
import { isFeatureEnabled } from 'utilities';

import { useGetPools } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import AccountPlaceholder from './AccountPlaceholder';
import PoolBreakdown from './PoolBreakdown';
import Summary from './Summary';
import { useStyles } from './styles';

export interface AccountUiProps {
  pools: Pool[];
  isFetchingPools?: boolean;
}

export const AccountUi: React.FC<AccountUiProps> = ({ isFetchingPools, pools }) => {
  const styles = useStyles();

  // Filter out pools user has not supplied in or borrowed from
  const filteredPools = useMemo(
    () =>
      pools.filter(
        pool =>
          !!pool.assets.find(
            asset => asset.userSupplyBalanceTokens.isGreaterThan(0) || asset.userBorrowBalanceTokens.isGreaterThan(0),
          ),
      ),
    [pools],
  );

  if (isFetchingPools) {
    return <Spinner />;
  }

  const hasSuppliedOrBorrowed = filteredPools.length > 0;

  if (!hasSuppliedOrBorrowed) {
    return <AccountPlaceholder />;
  }

  return (
    <>
      {isFeatureEnabled('isolatedPools') && <Summary css={styles.section} pools={filteredPools} />}

      {filteredPools.map(pool => (
        <PoolBreakdown key={`pool-breakdown-${pool.name}`} css={styles.section} pool={pool} />
      ))}
    </>
  );
};

const Account: React.FC = () => {
  const { accountAddress } = useAuth();
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  return <AccountUi isFetchingPools={isGetPoolsLoading} pools={getPoolsData?.pools || []} />;
};

export default Account;
