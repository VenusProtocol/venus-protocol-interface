import { useState } from 'react';

import {
  HealthFactorPill,
  Icon,
  SpokeWhitelistMarker,
  Table,
  type TableProps,
  TableRowControl,
} from 'components';
import { routes } from 'constants/routing';
import { SpokeFormModal } from 'containers/SpokeFormModal';
import { SpokePoolInfoModal } from 'containers/SpokePoolInfoModal';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset, SpokePool } from 'types';

import { useColumns } from './useColumns';

export interface SpokePoolCardProps
  extends Omit<TableProps<SpokeAsset>, 'columns' | 'rowKeyExtractor' | 'data'> {
  spokePool: SpokePool;
  loanAssets: SpokeAsset[];
  collaterals: SpokeAsset[];
}

export const SpokePoolCard: React.FC<SpokePoolCardProps> = ({
  spokePool,
  loanAssets,
  collaterals,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const [selectedCollateral, setSelectedCollateral] = useState<SpokeAsset>();
  const columns = useColumns({ collaterals, onCollateralClick: setSelectedCollateral });
  const hasUserPosition =
    !!spokePool.userSupplyBalanceCents?.isGreaterThan(0) ||
    !!spokePool.userBorrowBalanceCents?.isGreaterThan(0);
  const [selectedAsset, setSelectedAsset] = useState<SpokeAsset>();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const getRowHref = (asset: SpokeAsset) =>
    routes.spokeMarket.path
      .replace(':spokePoolComptrollerAddress', spokePool.comptrollerAddress)
      .replace(':spokeVTokenAddress', asset.vToken.address);

  const renderRowControl = (asset: SpokeAsset) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setSelectedAsset(asset);
    };

    return <TableRowControl className="-ml-6" onClick={handleClick} />;
  };

  return (
    <>
      <Table
        data={loanAssets}
        columns={columns}
        rowKeyExtractor={asset => asset.vToken.address}
        controls
        tableLayout="auto"
        breakpoint="lg"
        size="compact"
        hideCardDelimiter
        getRowHref={getRowHref}
        renderRowControl={renderRowControl}
        header={
          <div className="flex items-start justify-between gap-x-4">
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-p2s">{spokePool.name}</p>

                {spokePool.infoTags.length > 0 && (
                  <button
                    type="button"
                    aria-label={t('spokePoolInfo.button', { poolName: spokePool.name })}
                    onClick={() => setIsInfoModalOpen(true)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-secondary hover:text-brand"
                  >
                    <Icon name="info" className="size-4 text-inherit" />
                  </button>
                )}

                {spokePool.hasWhitelist && (
                  <SpokeWhitelistMarker
                    level="pool"
                    comptrollerAddress={spokePool.comptrollerAddress}
                    isUserWhitelisted={spokePool.isUserWhitelisted}
                  />
                )}
              </div>

              <p className="text-b1r text-secondary">{spokePool.description}</p>
            </div>

            {hasUserPosition && spokePool.userHealthFactor !== undefined && (
              <HealthFactorPill factor={spokePool.userHealthFactor} showLabel />
            )}
          </div>
        }
        {...otherProps}
      />

      <SpokePoolInfoModal
        spokePool={spokePool}
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />

      {selectedAsset && (
        <SpokeFormModal
          title={t('spokeForm.borrowModalTitle', {
            tokenSymbol: selectedAsset.vToken.underlyingToken.symbol,
            poolName: spokePool.name,
          })}
          spokePool={spokePool}
          asset={selectedAsset}
          initialLoanTabId={
            selectedAsset.disabledTokenActions.includes('borrow') ? 'repay' : 'borrow'
          }
          handleClose={() => setSelectedAsset(undefined)}
        />
      )}

      {selectedCollateral && (
        <SpokeFormModal
          title={t('spokeForm.collateralModalTitle', { poolName: spokePool.name })}
          spokePool={spokePool}
          asset={loanAssets[0]}
          collateralOnly
          initialActiveTabId="collateral"
          preselectedCollateral={selectedCollateral}
          handleClose={() => setSelectedCollateral(undefined)}
        />
      )}
    </>
  );
};
