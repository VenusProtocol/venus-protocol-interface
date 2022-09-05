/** @jsxImportSource @emotion/react */
import { Table, TableProps, TableRowProps, switchAriaLabel, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset, VTokenId } from 'types';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useBorrowRepayModal from 'hooks/useBorrowRepayModal';
import useCollateral from 'hooks/useCollateral';
import useSupplyWithdrawModal from 'hooks/useSupplyWithdrawModal';

import generateRow from './generateRow';
import { useStyles } from './styles';
import { ColumnName } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columns.asset')
// t('marketTable.columns.supplyApyLtv')
// t('marketTable.columns.borrowApy')
// t('marketTable.columns.market')
// t('marketTable.columns.riskLevel')
// t('marketTable.columns.collateral')
// t('marketTable.columns.walletBalance')
// t('marketTable.columns.liquidity')

export interface MarketTableProps
  extends Partial<Omit<TableProps, 'columns' | 'rowKeyIndex' | 'breakpoint'>>,
    Pick<TableProps, 'breakpoint'> {
  assets: Asset[];
  isXvsEnabled: boolean;
  marketType: 'supply' | 'borrow';
  columns: ColumnName[];
  className?: string;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  marketType,
  isXvsEnabled,
  columns,
  ...otherTableProps
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { BorrowRepayModal, openBorrowRepayModal } = useBorrowRepayModal({
    isXvsEnabled,
  });

  const { SupplyWithdrawModal, openSupplyWithdrawModal } = useSupplyWithdrawModal({
    isXvsEnabled,
  });

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

  // Format assets to rows
  const data: TableProps['data'] = useMemo(
    () =>
      assets.map(asset =>
        generateRow({
          asset,
          isXvsEnabled,
          columns,
          collateralOnChange: handleCollateralChange,
          marketLinkCss: styles.marketLink,
        }),
      ),
    [JSON.stringify(assets), JSON.stringify(columns)],
  );

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => {
    const assetId = row[0].value as VTokenId;

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

    if (marketType === 'borrow') {
      openBorrowRepayModal(assetId);
    } else {
      openSupplyWithdrawModal(assetId);
    }
  };

  return (
    <>
      <Table
        columns={headColumns}
        data={data}
        css={styles.cardContentGrid}
        rowKeyExtractor={rowKeyExtractor}
        rowOnClick={rowOnClick}
        {...otherTableProps}
      />

      <CollateralModal />
      <BorrowRepayModal />
      <SupplyWithdrawModal />
    </>
  );
};
