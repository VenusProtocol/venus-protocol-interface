/** @jsxImportSource @emotion/react */
import { RiskLevel, Table, TableColumn, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { useGetPools } from 'clients/api';
import poolRiskRatingMapping from 'constants/poolRiskRatingMapping';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { useStyles } from './styles';

interface PoolRow {
  pool: Pool;
  poolTotalSupplyCents: number;
  poolTotalBorrowCents: number;
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
            poolTotalSupplyCents: acc.poolTotalSupplyCents + item.supplyBalanceCents,
            poolTotalBorrowCents: acc.poolTotalBorrowCents + item.borrowBalanceCents,
          }),
          {
            poolTotalSupplyCents: 0,
            poolTotalBorrowCents: 0,
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
        renderCell: ({ pool }) => (
          <TokenGroup tokens={pool.assets.map(asset => asset.vToken.underlyingToken)} limit={4} />
        ),
      },
      {
        key: 'pool',
        label: t('pools.poolTable.columns.pool'),
        align: 'right',
        renderCell: ({ pool }) => pool.name,
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.pool.name.localeCompare(rowB.pool.name)
            : rowB.pool.name.localeCompare(rowA.pool.name),
      },
      {
        key: 'riskRating',
        label: t('pools.poolTable.columns.riskRating'),
        align: 'right',
        renderCell: ({ pool }) => <RiskLevel variant={pool.riskRating} />,
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? poolRiskRatingMapping[rowA.pool.riskRating] -
              poolRiskRatingMapping[rowB.pool.riskRating]
            : poolRiskRatingMapping[rowB.pool.riskRating] -
              poolRiskRatingMapping[rowA.pool.riskRating],
      },
      {
        key: 'totalSupply',
        label: t('pools.poolTable.columns.totalSupply'),
        align: 'right',
        renderCell: ({ poolTotalSupplyCents }) =>
          formatCentsToReadableValue({
            value: poolTotalSupplyCents,
            shortenLargeValue: true,
          }),
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.poolTotalSupplyCents - rowB.poolTotalSupplyCents
            : rowB.poolTotalSupplyCents - rowA.poolTotalSupplyCents,
      },
      {
        key: 'totalBorrow',
        label: t('pools.poolTable.columns.totalBorrow'),
        align: 'right',
        renderCell: ({ poolTotalBorrowCents }) =>
          formatCentsToReadableValue({
            value: poolTotalBorrowCents,
            shortenLargeValue: true,
          }),
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.poolTotalBorrowCents - rowB.poolTotalBorrowCents
            : rowB.poolTotalBorrowCents - rowA.poolTotalBorrowCents,
      },
      {
        key: 'liquidity',
        label: t('pools.poolTable.columns.liquidity'),
        align: 'right',
        renderCell: ({ poolTotalSupplyCents, poolTotalBorrowCents }) =>
          formatCentsToReadableValue({
            value: poolTotalSupplyCents - poolTotalBorrowCents,
            shortenLargeValue: true,
          }),
        sortRows: (rowA, rowB, direction) => {
          const poolALiquidityCents = rowA.poolTotalSupplyCents - rowA.poolTotalBorrowCents;
          const poolBLiquidityCents = rowB.poolTotalSupplyCents - rowB.poolTotalBorrowCents;

          return direction === 'asc'
            ? poolALiquidityCents - poolBLiquidityCents
            : poolBLiquidityCents - poolALiquidityCents;
        },
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      initialOrder={{
        orderBy: columns[5],
        orderDirection: 'desc',
      }}
      rowKeyExtractor={row => `pool-table-row-${row.pool.comptrollerAddress}`}
      getRowHref={row =>
        routes.pool.path.replace(':poolComptrollerAddress', row.pool.comptrollerAddress)
      }
      breakpoint="xxl"
      css={styles.cardContentGrid}
      isFetching={isFetchingPools}
    />
  );
};

const PoolTable = () => {
  const { accountAddress } = useAuth();
  const { data: poolData, isLoading } = useGetPools({ accountAddress });

  return <PoolTableUi pools={poolData?.pools || []} isFetchingPools={isLoading} />;
};

export default PoolTable;
