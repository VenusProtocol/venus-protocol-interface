import { useState } from 'react';

import { routes } from 'constants/routing';
import { ModalDetailLink } from 'containers/ModalDetailLink';
import { getSpokeMarketTo } from 'containers/ModalDetailLink/getSpokeMarketTo';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { useTranslation } from 'libs/translations';
import { COLLATERAL_PARAM_KEY, POOL_PARAM_KEY } from 'pages/SpokePools/constants';
import type { SpokeAsset, SpokePool, TokenAction } from 'types';

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

  const collaterals = spokePool.assets.filter(asset =>
    asset.userSupplyBalanceTokens.isGreaterThan(0),
  );
  const loanAssets = spokePool.assets.filter(asset =>
    asset.userBorrowBalanceTokens.isGreaterThan(0),
  );

  const firstLoanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable);

  const handleClose = () => setSelectedRow(undefined);

  // Checks whether that side is paused, not the whole market
  const pausedActions: TokenAction[] = selectedRow?.isCollateral
    ? ['supply', 'enterMarket']
    : ['borrow'];

  const isSelectedRowPaused =
    !!selectedRow &&
    pausedActions.some(action => selectedRow.asset.disabledTokenActions.includes(action));

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
            <span className="inline-flex items-center gap-x-2">
              {selectedRow.isCollateral
                ? t('spokeForm.collateralModalTitle', { poolName: spokePool.name })
                : t('spokeForm.borrowModalTitle', {
                    tokenSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                    poolName: spokePool.name,
                  })}
              {selectedRow.isCollateral ? (
                <ModalDetailLink
                  getTo={() => ({
                    pathname: routes.spokePools.path,
                    search: new URLSearchParams({
                      [COLLATERAL_PARAM_KEY]: selectedRow.asset.vToken.underlyingToken.symbol,
                      [POOL_PARAM_KEY]: spokePool.name,
                    }).toString(),
                  })}
                  destination={t('modalDetailLink.destination.spokePool', {
                    tokenSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                    poolName: spokePool.name,
                  })}
                  analyticProps={{
                    variant: 'dashboard_spoke_supply',
                    destination: 'spoke_pools',
                    poolName: spokePool.name,
                    assetSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                  }}
                />
              ) : (
                <ModalDetailLink
                  getTo={activeTabPath =>
                    getSpokeMarketTo({
                      spokePoolComptrollerAddress: spokePool.comptrollerAddress,
                      spokeVTokenAddress: selectedRow.asset.vToken.address,
                      activeTabPath,
                    })
                  }
                  destination={t('modalDetailLink.destination.spokeMarket', {
                    tokenSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                    poolName: spokePool.name,
                  })}
                  analyticProps={{
                    variant: 'dashboard_spoke_borrow',
                    destination: 'spoke_market',
                    poolName: spokePool.name,
                    assetSymbol: selectedRow.asset.vToken.underlyingToken.symbol,
                  }}
                />
              )}
            </span>
          }
          spokePool={spokePool}
          asset={selectedRow.isCollateral ? firstLoanAsset : selectedRow.asset}
          // PRD shows the collateral side as a standalone modal
          collateralOnly={selectedRow.isCollateral}
          initialActiveTabId={selectedRow.isCollateral ? 'collateral' : 'loan'}
          // Exiting is never gated, so paused markets open on exit
          initialCollateralTabId={isSelectedRowPaused ? 'withdraw' : 'supply'}
          initialLoanTabId={isSelectedRowPaused ? 'repay' : 'borrow'}
          preselectedCollateral={selectedRow.isCollateral ? selectedRow.asset : undefined}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
