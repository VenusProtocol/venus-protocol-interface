/** @jsxImportSource @emotion/react */
import { RiskLevel, Select, Table, TableProps, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { poolData } from '__mocks__/models/pools';
import { routes } from 'constants/routing';
import { useShowXxlDownCss } from 'hooks/responsive';

import { useStyles } from './styles';

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

  const columns = useMemo(
    () => [
      { key: 'assets', label: t('pools.poolTable.columns.assets'), orderable: false },
      {
        key: 'pool',
        label: t('pools.poolTable.columns.pool'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'riskLevel',
        label: t('pools.poolTable.columns.riskLevel'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'totalSupply',
        label: t('pools.poolTable.columns.totalSupply'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'totalBorrow',
        label: t('pools.poolTable.columns.totalBorrow'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'liquidity',
        label: t('pools.poolTable.columns.liquidity'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format pools to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      pools.map(pool => {
        const { totalSupplyCents, totalBorrowCents } = pool.assets.reduce(
          (acc, item) => ({
            totalSupplyCents: item.treasuryTotalSupplyCents.plus(acc.totalSupplyCents).toNumber(),
            totalBorrowCents: item.treasuryTotalBorrowsCents.plus(acc.totalBorrowCents).toNumber(),
          }),
          {
            totalSupplyCents: 0,
            totalBorrowCents: 0,
          },
        );

        const liquidityCents = totalSupplyCents - totalBorrowCents;

        return [
          {
            key: 'assets',
            render: () => <TokenGroup tokens={pool.assets.map(asset => asset.token)} limit={4} />,
            value: pool.id,
          },
          {
            key: 'pool',
            render: () => pool.name,
            value: pool.name,
            align: 'right',
          },
          {
            key: 'riskLevel',
            render: () => <RiskLevel variant={pool.riskLevel} />,
            value: pool.riskLevel,
            align: 'right',
          },
          {
            key: 'totalSupply',
            render: () =>
              formatCentsToReadableValue({
                value: totalSupplyCents,
                shortenLargeValue: true,
              }),
            align: 'right',
            value: totalSupplyCents,
          },
          {
            key: 'totalBorrow',
            render: () =>
              formatCentsToReadableValue({
                value: totalBorrowCents,
                shortenLargeValue: true,
              }),
            value: totalBorrowCents,
            align: 'right',
          },
          {
            key: 'liquidity',
            render: () =>
              formatCentsToReadableValue({
                value: liquidityCents,
                shortenLargeValue: true,
              }),
            value: liquidityCents,
            align: 'right',
          },
        ];
      }),
    [JSON.stringify(pools)],
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
        data={rows}
        initialOrder={{
          orderBy: 'liquidity',
          orderDirection: 'desc',
        }}
        rowKeyExtractor={row => `${row[0].value}`}
        getRowHref={row => routes.pool.path.replace(':poolId', `${row[0].value}`)}
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
