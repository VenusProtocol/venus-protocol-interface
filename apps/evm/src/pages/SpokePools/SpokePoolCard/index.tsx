import { HealthFactorPill, Table, type TableProps } from 'components';
import { routes } from 'constants/routing';
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
  const columns = useColumns({ collaterals });

  const getRowHref = (asset: SpokeAsset) =>
    routes.spokeMarket.path
      .replace(':spokePoolComptrollerAddress', spokePool.comptrollerAddress)
      .replace(':spokeVTokenAddress', asset.vToken.address);

  return (
    <Table
      data={loanAssets}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      controls
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      getRowHref={getRowHref}
      header={
        <div className="flex items-start justify-between gap-x-4">
          <div>
            <p className="text-p2s">{spokePool.name}</p>
            <p className="text-b1r text-grey">{spokePool.description}</p>
          </div>

          {spokePool.userHealthFactor !== undefined && (
            <HealthFactorPill factor={spokePool.userHealthFactor} showLabel />
          )}
        </div>
      }
      {...otherProps}
    />
  );
};
