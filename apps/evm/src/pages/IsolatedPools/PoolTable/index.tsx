/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetIsolatedPools } from 'clients/api';
import { Table, type TableColumn, TokenGroup } from 'components';
import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Pool } from 'types';
import { areAddressesEqual, formatCentsToReadableValue } from 'utilities';

import { useNavigate } from 'hooks/useNavigate';
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
  const { navigate } = useNavigate();

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
        header: t('pools.poolTable.columns.assets'),
        enableSorting: false,
        meta: {
          className: 'min-w-60',
        },
        cell: ({ row }) => (
          <TokenGroup
            tokens={row.original.pool.assets.map(asset => asset.vToken.underlyingToken)}
            limit={7}
          />
        ),
      },
      {
        accessorFn: row => row.pool.name,
        header: t('pools.poolTable.columns.pool'),
        cell: ({ row }) => row.original.pool.name,
      },
      {
        accessorFn: row => row.poolTotalSupplyCents.toNumber(),
        header: t('pools.poolTable.columns.totalSupply'),
        cell: ({ row }) =>
          formatCentsToReadableValue({
            value: row.original.poolTotalSupplyCents,
          }),
      },
      {
        accessorFn: row => row.poolTotalBorrowCents.toNumber(),
        header: t('pools.poolTable.columns.totalBorrow'),
        cell: ({ row }) =>
          formatCentsToReadableValue({
            value: row.original.poolTotalBorrowCents,
          }),
      },
      {
        accessorFn: row => row.poolTotalSupplyCents.minus(row.poolTotalBorrowCents).toNumber(),
        header: t('pools.poolTable.columns.liquidity'),
        cell: ({ row }) =>
          formatCentsToReadableValue({
            value: row.original.poolTotalSupplyCents.minus(row.original.poolTotalBorrowCents),
          }),
      },
    ],
    [t],
  );

  return (
    <Table
      columns={columns}
      data={data}
      initialState={{
        sorting: [
          {
            id: 'liquidity',
            desc: true,
          },
        ],
      }}
      onRowClick={(_e, row) =>
        navigate(
          routes.isolatedPool.path.replace(
            ':poolComptrollerAddress',
            row.original.pool.comptrollerAddress,
          ),
        )
      }
      css={styles.cardContentGrid}
      isFetching={isFetchingPools}
    />
  );
};

const PoolTable = () => {
  const { accountAddress } = useAccountAddress();
  const { data: poolData, isLoading } = useGetIsolatedPools({ accountAddress });
  const { corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress } =
    useGetChainMetadata();

  // Filter out core pool (on some chains the core pool is one of the isolated pools)
  const pools = useMemo(
    () =>
      (poolData?.pools || []).filter(
        pool =>
          !areAddressesEqual(pool.comptrollerAddress, corePoolComptrollerContractAddress) &&
          (!stakedEthPoolComptrollerContractAddress ||
            !areAddressesEqual(pool.comptrollerAddress, stakedEthPoolComptrollerContractAddress)),
      ),
    [poolData?.pools, corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress],
  );

  return <PoolTableUi pools={pools} isFetchingPools={isLoading} />;
};

export default PoolTable;
