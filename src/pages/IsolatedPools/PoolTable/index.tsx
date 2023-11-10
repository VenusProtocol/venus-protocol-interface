/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Table, TableColumn, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { useGetIsolatedPools } from 'clients/api';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { useStyles } from './styles';

interface PoolRow {
  pool: Pool;
  poolTotalSupplyCents: BigNumber;
  poolTotalBorrowCents: BigNumber;
}

export interface PoolTableProps {
  pools: Pool[];
  isFetchingPools: boolean;
}

export const PoolTableUi: React.FC<PoolTableProps> = ({ pools, isFetchingPools }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  // Format pools into rows
  const data: PoolRow[] = useMemo(
    () =>
      pools.map(pool => {
        const { poolTotalSupplyCents, poolTotalBorrowCents } = pool.assets.reduce(
          (acc, item) => ({
            poolTotalSupplyCents: acc.poolTotalSupplyCents.plus(item.supplyBalanceCents),
            poolTotalBorrowCents: acc.poolTotalBorrowCents.plus(item.borrowBalanceCents),
          }),
          {
            poolTotalSupplyCents: new BigNumber(0),
            poolTotalBorrowCents: new BigNumber(0),
          },
        );

        return { pool, poolTotalSupplyCents, poolTotalBorrowCents };
      }),
    [pools],
  );

  const columns: TableColumn<PoolRow>[] = useMemo(
    () => [
      {
        key: 'assets',
        label: t('pools.poolTable.columns.assets'),
        selectOptionLabel: t('pools.poolTable.columns.assets'),
        renderCell: ({ pool }) => (
          <TokenGroup tokens={pool.assets.map(asset => asset.vToken.underlyingToken)} limit={7} />
        ),
      },
      {
        key: 'pool',
        label: t('pools.poolTable.columns.pool'),
        selectOptionLabel: t('pools.poolTable.columns.pool'),
        align: 'right',
        renderCell: ({ pool }) => pool.name,
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.pool.name.localeCompare(rowB.pool.name)
            : rowB.pool.name.localeCompare(rowA.pool.name),
      },
      {
        key: 'totalSupply',
        label: t('pools.poolTable.columns.totalSupply'),
        selectOptionLabel: t('pools.poolTable.columns.totalSupply'),
        align: 'right',
        renderCell: ({ poolTotalSupplyCents }) =>
          formatCentsToReadableValue({
            value: poolTotalSupplyCents,
          }),
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.poolTotalSupplyCents.minus(rowB.poolTotalSupplyCents).toNumber()
            : rowB.poolTotalSupplyCents.minus(rowA.poolTotalSupplyCents).toNumber(),
      },
      {
        key: 'totalBorrow',
        label: t('pools.poolTable.columns.totalBorrow'),
        selectOptionLabel: t('pools.poolTable.columns.totalBorrow'),
        align: 'right',
        renderCell: ({ poolTotalBorrowCents }) =>
          formatCentsToReadableValue({
            value: poolTotalBorrowCents,
          }),
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.poolTotalBorrowCents.minus(rowB.poolTotalBorrowCents).toNumber()
            : rowB.poolTotalBorrowCents.minus(rowA.poolTotalBorrowCents).toNumber(),
      },
      {
        key: 'liquidity',
        label: t('pools.poolTable.columns.liquidity'),
        selectOptionLabel: t('pools.poolTable.columns.liquidity'),
        align: 'right',
        renderCell: ({ poolTotalSupplyCents, poolTotalBorrowCents }) =>
          formatCentsToReadableValue({
            value: poolTotalSupplyCents.minus(poolTotalBorrowCents),
          }),
        sortRows: (rowA, rowB, direction) => {
          const poolALiquidityCents = rowA.poolTotalSupplyCents.minus(rowA.poolTotalBorrowCents);
          const poolBLiquidityCents = rowB.poolTotalSupplyCents.minus(rowB.poolTotalBorrowCents);

          return direction === 'asc'
            ? poolALiquidityCents.minus(poolBLiquidityCents).toNumber()
            : poolBLiquidityCents.minus(poolALiquidityCents).toNumber();
        },
      },
    ],
    [t],
  );

  return (
    <Table
      columns={columns}
      data={data}
      initialOrder={{
        orderBy: columns[4],
        orderDirection: 'desc',
      }}
      rowKeyExtractor={row => `pool-table-row-${row.pool.comptrollerAddress}`}
      getRowHref={row =>
        row.pool.isIsolated
          ? routes.isolatedPool.path.replace(':poolComptrollerAddress', row.pool.comptrollerAddress)
          : routes.corePool.path
      }
      breakpoint="xxl"
      css={styles.cardContentGrid}
      isFetching={isFetchingPools}
    />
  );
};

const PoolTable = () => {
  const { accountAddress } = useAuth();
  const { data: poolData, isLoading } = useGetIsolatedPools({ accountAddress });

  return <PoolTableUi pools={poolData?.pools || []} isFetchingPools={isLoading} />;
};

export default PoolTable;
