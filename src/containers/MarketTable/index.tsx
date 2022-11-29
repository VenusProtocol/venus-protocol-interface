/** @jsxImportSource @emotion/react */
import { Table, TableProps, TableRowProps, switchAriaLabel, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { unsafelyGetToken, unsafelyGetVToken } from 'utilities';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useBorrowRepayModal from 'hooks/useBorrowRepayModal';
import useCollateral from 'hooks/useCollateral';
import useSupplyWithdrawModal from 'hooks/useSupplyWithdrawModal';

import { useStyles } from './styles';
import { ColumnName } from './types';
import useGenerateData from './useGenerateData';

export interface MarketTableProps
  extends Partial<Omit<TableProps, 'columns' | 'rowKeyIndex' | 'breakpoint'>>,
    Pick<TableProps, 'breakpoint'> {
  assets: Asset[];
  columns: ColumnName[];
  marketType?: 'supply' | 'borrow';
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  marketType,
  columns,
  getRowHref,
  ...otherTableProps
}) => {
  const { t } = useTranslation();
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

  const rowKeyExtractor = (row: TableRowProps[]) => {
    // Generate key using data that's unique to the row (asset and market)
    let key = `${row.find(cell => cell.key === 'asset')?.value || ''}`;

    const marketCell = row.find(cell => cell.key === 'market');
    if (marketCell) {
      key += `-${marketCell.value}`;
    }

    return key;
  };

  const headColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        key: column,
        label: t(`marketTable.columns.${column}`),
        orderable: true,
        align: index === 0 ? 'left' : 'right',
      })),
    [JSON.stringify(columns)],
  );

  const data = useGenerateData({
    assets,
    columns,
    collateralOnChange: handleCollateralChange,
  });

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => {
    const assetId = row[0].value as string;

    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the supply modal of other assets
    if (hasLunaOrUstCollateralEnabled && assetId !== TOKENS.luna.id && assetId !== TOKENS.ust.id) {
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

    // TODO: get token and vToken from row directly (requires update of Table
    // component, see VEN-490)
    const token = unsafelyGetToken(assetId);
    const vToken = unsafelyGetVToken(assetId);

    if (marketType === 'borrow') {
      openBorrowRepayModal({ token, vToken });
    } else {
      openSupplyWithdrawModal({ token, vToken });
    }
  };

  return (
    <>
      <Table
        columns={headColumns}
        data={data}
        css={styles.cardContentGrid}
        rowKeyExtractor={rowKeyExtractor}
        rowOnClick={getRowHref ? undefined : rowOnClick}
        getRowHref={getRowHref}
        {...otherTableProps}
      />

      <CollateralModal />
      <BorrowRepayModal />
      <SupplyWithdrawModal />
    </>
  );
};
