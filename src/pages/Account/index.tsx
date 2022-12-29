/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup, Spinner } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { useGetPools } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import PoolBreakdown from './PoolBreakdown';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface AccountUiProps {
  pools: Pool[];
  isFetchingPools: boolean;
  netApyPercentage?: number;
  dailyEarningsCents?: number;
  totalSupplyCents?: number;
  totalBorrowCents?: number;
}

export const AccountUi: React.FC<AccountUiProps> = ({
  netApyPercentage,
  dailyEarningsCents,
  totalSupplyCents,
  totalBorrowCents,
  isFetchingPools,
  pools,
}) => {
  const { t } = useTranslation();
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

  const cells: Cell[] = [
    {
      label: t('account.accountSummary.netApy'),
      value: formatToReadablePercentage(netApyPercentage),
      tooltip: t('account.accountSummary.netApyTooltip'),
      color: styles.getNetApyColor({ netApyPercentage: netApyPercentage || 0 }),
    },
    {
      label: t('account.accountSummary.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
    },
    {
      label: t('account.accountSummary.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('account.accountSummary.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
  ];

  return (
    <>
      <div css={styles.section}>
        <div css={styles.sectionTitle}>
          <Typography variant="h3" css={styles.sectionTitleText}>
            {t('account.accountSummary.title')}
          </Typography>
        </div>

        <CellGroup cells={cells} data-testid={TEST_IDS.stats} />
      </div>

      {isFetchingPools ? (
        <Spinner />
      ) : (
        <>
          {filteredPools.map(pool => (
            <PoolBreakdown key={`pool-breakdown-${pool.name}`} css={styles.section} pool={pool} />
          ))}
        </>
      )}
    </>
  );
};

const Account: React.FC = () => {
  // TODO: fetch (see VEN-548)
  const netApyPercentage = 13.4;
  const dailyEarningsCents = 100000;
  const totalSupplyCents = 100000000;
  const totalBorrowCents = 10000000;

  const { account } = useContext(AuthContext);
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress: account?.address,
  });

  return (
    <AccountUi
      netApyPercentage={netApyPercentage}
      dailyEarningsCents={dailyEarningsCents}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
      isFetchingPools={isGetPoolsLoading}
      pools={getPoolsData?.pools || []}
    />
  );
};

export default Account;
