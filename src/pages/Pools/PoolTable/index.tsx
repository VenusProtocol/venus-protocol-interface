/** @jsxImportSource @emotion/react */
import { RiskLevel, Select, Table, TableColumn, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { poolData } from '__mocks__/models/pools';
import { routes } from 'constants/routing';
import { useShowXxlDownCss } from 'hooks/responsive';

import { useStyles } from './styles';

interface PoolRow {
  pool: Pool;
  poolTotalSupplyCents: number;
  poolTotalBorrowCents: number;
}

const riskLevelMap = {
  MINIMAL: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

export interface PoolTableProps {
  pools: Pool[];
}

export const PoolTableUi: React.FC<PoolTableProps> = ({ pools }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const showXxlDownCss = useShowXxlDownCss();

  // TODO: add all options
  const mobileSelectOptions = [
    {
      value: 'riskLevel',
      label: 'Risk level',
    },
  ];

  // Format pools into rows
  const data: PoolRow[] = useMemo(
    () =>
      pools.map(pool => {
        const { poolTotalSupplyCents, poolTotalBorrowCents } = pool.assets.reduce(
          (acc, item) => ({
            poolTotalSupplyCents: item.treasuryTotalSupplyCents
              .plus(acc.poolTotalSupplyCents)
              .toNumber(),
            poolTotalBorrowCents: item.treasuryTotalBorrowsCents
              .plus(acc.poolTotalBorrowCents)
              .toNumber(),
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
          <TokenGroup tokens={pool.assets.map(asset => asset.token)} limit={4} />
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
        key: 'riskLevel',
        label: t('pools.poolTable.columns.riskLevel'),
        align: 'right',
        renderCell: ({ pool }) => <RiskLevel variant={pool.riskLevel} />,
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? riskLevelMap[rowA.pool.riskLevel] - riskLevelMap[rowB.pool.riskLevel]
            : riskLevelMap[rowB.pool.riskLevel] - riskLevelMap[rowA.pool.riskLevel],
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
        label: t('pools.poolTable.columns.totalBorrow'),
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
    <>
      <Select
        css={[styles.mobileSelect, showXxlDownCss]}
        label={t('markets.mobileSelect.label')}
        title={t('markets.mobileSelect.title')}
        // TODO: wire up
        value={mobileSelectOptions[0].value}
        onChange={console.log}
        options={mobileSelectOptions}
        ariaLabel={t('markets.mobileSelect.ariaLabelFor')}
      />

      <Table
        columns={columns}
        data={data}
        initialOrder={{
          orderBy: columns[5],
          orderDirection: 'desc',
        }}
        rowKeyExtractor={row => `pool-table-row-${row.pool.id}`}
        getRowHref={row => routes.pool.path.replace(':poolId', row.pool.id)}
        breakpoint="xxl"
        css={styles.cardContentGrid}
      />
    </>
  );
};

const PoolTable = () => {
  // TODO: fetch actual value (see VEN-546)
  const pools = poolData;

  return <PoolTableUi pools={pools} />;
};

export default PoolTable;
