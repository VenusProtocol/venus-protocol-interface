/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { Table, type TableProps, switchAriaLabel } from 'components';
import useCollateral from 'hooks/useCollateral';
import useOperationModal from 'hooks/useOperationModal';
import { displayMutationError } from 'libs/errors';
import { useLunaUstWarning } from 'libs/lunaUstWarning';
import type { Pool } from 'types';

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

  const { OperationModal, openOperationModal } = useOperationModal();
  const { toggleCollateral } = useCollateral();

  const { userHasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useLunaUstWarning();

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

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: PoolAsset) => {
    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the supply modal of other assets
    if (
      userHasLunaOrUstCollateralEnabled &&
      row.vToken.underlyingToken.symbol !== 'LUNA' &&
      row.vToken.underlyingToken.symbol !== 'UST'
    ) {
      e.preventDefault();
      e.stopPropagation();
      openLunaUstWarningModal();
      return;
    }

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
  };

  return (
    <div data-testid={testId}>
      <Table
        columns={columns}
        data={poolAssets}
        css={styles.cardContentGrid}
        rowKeyExtractor={row => `market-table-row-${marketType}-${row.vToken.address}`}
        rowOnClick={getRowHref ? undefined : rowOnClick}
        getRowHref={getRowHref}
        initialOrder={formattedInitialOrder}
        {...otherTableProps}
      />

      <OperationModal />
    </div>
  );
};
