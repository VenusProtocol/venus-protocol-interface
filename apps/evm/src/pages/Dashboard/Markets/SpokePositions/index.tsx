import { useState } from 'react';

import { SpokeFormModal } from 'containers/SpokeFormModal';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset, SpokePool } from 'types';
import { isAssetPaused } from 'utilities';

import { BorrowedTable } from './BorrowedTable';
import { SummaryRow } from './SummaryRow';
import { SuppliedTable } from './SuppliedTable';

export interface SpokePositionsProps {
  spokePool: SpokePool;
}

interface SelectedRow {
  asset: SpokeAsset;
  isCollateral: boolean;
}

export const SpokePositions: React.FC<SpokePositionsProps> = ({ spokePool }) => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<SelectedRow>();

  const collaterals = spokePool.assets.filter(
    asset => !asset.isBorrowable && asset.userSupplyBalanceTokens.isGreaterThan(0),
  );
  const loanAssets = spokePool.assets.filter(
    asset => asset.isBorrowable && asset.userBorrowBalanceTokens.isGreaterThan(0),
  );

  const firstLoanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable);

  const handleClose = () => setSelectedRow(undefined);

  const isSelectedRowPaused =
    !!selectedRow &&
    isAssetPaused({ disabledTokenActions: selectedRow.asset.disabledTokenActions });

  return (
    <div className="space-y-6">
      <SummaryRow spokePool={spokePool} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SuppliedTable
          collaterals={collaterals}
          onRowClick={asset => setSelectedRow({ asset, isCollateral: true })}
        />

        <BorrowedTable
          spokePool={spokePool}
          loanAssets={loanAssets}
          onRowClick={asset => setSelectedRow({ asset, isCollateral: false })}
        />
      </div>

      {selectedRow && (
        <SpokeFormModal
          title={
            selectedRow.isCollateral
              ? t('spokeForm.collateralModalTitle', { poolName: spokePool.name })
              : t('spokeForm.borrowModalTitle', {
                  tokenSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                  poolName: spokePool.name,
                })
          }
          spokePool={spokePool}
          asset={selectedRow.isCollateral ? firstLoanAsset : selectedRow.asset}
          initialActiveTabId={selectedRow.isCollateral ? 'collateral' : 'loan'}
          // Exiting is never gated, so a paused market opens straight on the way out
          initialCollateralTabId={isSelectedRowPaused ? 'withdraw' : 'supply'}
          initialLoanTabId={isSelectedRowPaused ? 'repay' : 'borrow'}
          preselectedCollateral={selectedRow.isCollateral ? selectedRow.asset : undefined}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
