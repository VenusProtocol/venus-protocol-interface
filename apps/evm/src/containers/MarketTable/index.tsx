/** @jsxImportSource @emotion/react */
import { useCallback, useMemo } from 'react';

import { Table, type TableProps, switchAriaLabel } from 'components';
import useCollateral from 'hooks/useCollateral';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useOperationModal from 'hooks/useOperationModal';
import { displayMutationError } from 'libs/errors';
import type { Pool } from 'types';

import { routes } from 'constants/routing';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { areAddressesEqual } from 'utilities';
import { useStyles } from './styles';
import type { ColumnKey, PoolAsset } from './types';
import useGenerateColumns from './useGenerateColumns';

export interface MarketTableProps
  extends Partial<
      Omit<TableProps<PoolAsset>, 'columns' | 'rowKeyIndex' | 'breakpoint' | 'initialOrder'>
    >,
    Pick<TableProps<PoolAsset>, 'breakpoint'> {
  pools: Pool[];
  columns: ColumnKey[];
  initialOrder?: {
    orderBy: ColumnKey;
    orderDirection: 'asc' | 'desc';
  };
  marketType?: 'supply' | 'borrow';
  className?: string;
  testId?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  pools,
  marketType,
  columns: columnKeys,
  getRowHref,
  initialOrder,
  testId,
  ...otherTableProps
}) => {
  const styles = useStyles();

  const isNewMarketPageEnabled = useIsFeatureEnabled({ name: 'newMarketPage' });
  const { corePoolComptrollerContractAddress, lidoPoolComptrollerContractAddress } =
    useGetChainMetadata();
  const { OperationModal, openOperationModal } = useOperationModal();
  const { toggleCollateral } = useCollateral();

  const handleCollateralChange = async (poolAssetToUpdate: PoolAsset) => {
    try {
      await toggleCollateral({
        asset: poolAssetToUpdate,
        poolName: poolAssetToUpdate.pool.name,
        comptrollerAddress: poolAssetToUpdate.pool.comptrollerAddress,
      });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const poolAssets = useMemo(
    () =>
      pools.reduce((acc, pool) => {
        const newPoolAssets: PoolAsset[] = pool.assets.map(asset => ({
          ...asset,
          pool,
        }));

        return acc.concat(newPoolAssets);
      }, [] as PoolAsset[]),
    [pools],
  );

  const columns = useGenerateColumns({
    columnKeys,
    collateralOnChange: handleCollateralChange,
  });

  const formattedInitialOrder = useMemo(() => {
    if (!initialOrder) {
      return undefined;
    }

    const oderByColumn = columns.find(column => column.key === initialOrder.orderBy);

    return (
      oderByColumn && {
        orderBy: oderByColumn,
        orderDirection: initialOrder.orderDirection,
      }
    );
  }, [columns, initialOrder]);

  const rowOnClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, row: PoolAsset) => {
      // Do nothing if user clicked on switch (the switch element will handle the
      // click event)
      if ((e.target as HTMLElement).ariaLabel === switchAriaLabel) {
        return;
      }

      openOperationModal({
        vToken: row.vToken,
        poolComptrollerAddress: row.pool.comptrollerAddress,
        initialActiveTabIndex: marketType === 'supply' ? 0 : 2,
      });
    },
    [marketType, openOperationModal],
  );

  const rowHref = useCallback(
    (row: PoolAsset) => {
      if (areAddressesEqual(row.pool.comptrollerAddress, corePoolComptrollerContractAddress)) {
        return routes.corePoolMarket.path.replace(':vTokenAddress', row.vToken.address);
      }

      if (
        lidoPoolComptrollerContractAddress &&
        areAddressesEqual(row.pool.comptrollerAddress, lidoPoolComptrollerContractAddress)
      ) {
        return routes.lidoPoolMarket.path.replace(':vTokenAddress', row.vToken.address);
      }

      return routes.isolatedPoolMarket.path
        .replace(':poolComptrollerAddress', row.pool.comptrollerAddress)
        .replace(':vTokenAddress', row.vToken.address);
    },
    [
      corePoolComptrollerContractAddress,
      lidoPoolComptrollerContractAddress,
      lidoPoolComptrollerContractAddress,
    ],
  );

  const navProps: Partial<TableProps<PoolAsset>> = isNewMarketPageEnabled
    ? {
        getRowHref: getRowHref || rowHref,
      }
    : {
        rowOnClick: getRowHref ? undefined : rowOnClick,
        getRowHref: getRowHref,
      };

  return (
    <div data-testid={testId}>
      <Table
        columns={columns}
        data={poolAssets}
        css={styles.cardContentGrid}
        rowKeyExtractor={row => `market-table-row-${marketType}-${row.vToken.address}`}
        initialOrder={formattedInitialOrder}
        {...navProps}
        {...otherTableProps}
      />

      <OperationModal />
    </div>
  );
};
