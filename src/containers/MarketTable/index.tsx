/** @jsxImportSource @emotion/react */
import { Table, TableProps, switchAriaLabel, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import { useContext, useMemo } from 'react';
import * as React from 'react';
import { Pool } from 'types';

import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useCollateral from 'hooks/useCollateral';
import useOperationModal from 'hooks/useOperationModal';

import { useStyles } from './styles';
import { ColumnKey, PoolAsset } from './types';
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
  const { CollateralModal, toggleCollateral } = useCollateral();

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const handleCollateralChange = async (poolAssetToUpdate: PoolAsset) => {
    try {
      await toggleCollateral({
        asset: poolAssetToUpdate,
        poolName: poolAssetToUpdate.pool.name,
        comptrollerAddress: poolAssetToUpdate.pool.comptrollerAddress,
      });
    } catch (e) {
      if (e instanceof VError) {
        toast.error({
          message: formatVErrorToReadableString(e),
        });
      }
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
    poolAssets,
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
      hasLunaOrUstCollateralEnabled &&
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

      <CollateralModal />
      <OperationModal />
    </div>
  );
};
