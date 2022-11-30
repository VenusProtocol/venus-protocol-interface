/** @jsxImportSource @emotion/react */
import { Table, TableProps, switchAriaLabel, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useContext, useMemo } from 'react';
import { Asset } from 'types';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useBorrowRepayModal from 'hooks/useBorrowRepayModal';
import useCollateral from 'hooks/useCollateral';
import useSupplyWithdrawModal from 'hooks/useSupplyWithdrawModal';

import { useStyles } from './styles';
import { ColumnKey } from './types';
import useGenerateColumns from './useGenerateColumns';

export interface MarketTableProps
  extends Partial<
      Omit<TableProps<Asset>, 'columns' | 'rowKeyIndex' | 'breakpoint' | 'initialOrder'>
    >,
    Pick<TableProps<Asset>, 'breakpoint'> {
  assets: Asset[];
  columns: ColumnKey[];
  initialOrder?: {
    orderBy: ColumnKey;
    orderDirection: 'asc' | 'desc';
  };
  marketType?: 'supply' | 'borrow';
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  marketType,
  columns: columnKeys,
  getRowHref,
  initialOrder,
  ...otherTableProps
}) => {
  const styles = useStyles();

  const { BorrowRepayModal, openBorrowRepayModal } = useBorrowRepayModal();
  const { SupplyWithdrawModal, openSupplyWithdrawModal } = useSupplyWithdrawModal();
  const { CollateralModal, toggleCollateral } = useCollateral();

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const handleCollateralChange = async (assetToUpdate: Asset) => {
    try {
      await toggleCollateral(assetToUpdate);
    } catch (e) {
      if (e instanceof VError) {
        toast.error({
          message: formatVErrorToReadableString(e),
        });
      }
    }
  };

  const columns = useGenerateColumns({
    assets,
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

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: Asset) => {
    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the supply modal of other assets
    if (
      hasLunaOrUstCollateralEnabled &&
      row.token.address !== TOKENS.luna.address &&
      row.token.address !== TOKENS.ust.address
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

    if (marketType === 'borrow') {
      openBorrowRepayModal({ token: row.token, vToken: row.vToken });
    } else {
      openSupplyWithdrawModal({ token: row.token, vToken: row.vToken });
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={assets}
        css={styles.cardContentGrid}
        rowKeyExtractor={row => `market-table-row-${marketType}-${row.token.address}`}
        rowOnClick={getRowHref ? undefined : rowOnClick}
        getRowHref={getRowHref}
        initialOrder={formattedInitialOrder}
        {...otherTableProps}
      />

      <CollateralModal />
      <BorrowRepayModal />
      <SupplyWithdrawModal />
    </>
  );
};
