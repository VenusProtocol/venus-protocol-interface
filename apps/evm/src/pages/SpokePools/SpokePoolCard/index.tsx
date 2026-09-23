import { useState } from 'react';

import { HealthFactorPill, Table, type TableProps, TableRowControl } from 'components';
import { routes } from 'constants/routing';
import { SpokeFormModal } from 'containers/SpokeFormModal';
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
  const columns = useColumns({ collaterals });
  const hasUserPosition =
    !!spokePool.userSupplyBalanceCents?.isGreaterThan(0) ||
    !!spokePool.userBorrowBalanceCents?.isGreaterThan(0);
  const [selectedAsset, setSelectedAsset] = useState<SpokeAsset>();

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
        breakpoint="md"
        hideCardDelimiter
        getRowHref={getRowHref}
        renderRowControl={renderRowControl}
        header={
          <div className="flex items-start justify-between gap-x-4">
            <div>
              <p className="text-p2s">{spokePool.name}</p>
              <p className="text-b1r text-grey">{spokePool.description}</p>
            </div>

            {hasUserPosition && spokePool.userHealthFactor !== undefined && (
              <HealthFactorPill factor={spokePool.userHealthFactor} showLabel />
            )}
          </div>
        }
        {...otherProps}
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
    </>
  );
};
