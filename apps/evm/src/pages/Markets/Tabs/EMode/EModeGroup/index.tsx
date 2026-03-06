import { Delimiter, type Order, Table, type TableColumn } from 'components';
import { routes } from 'constants/routing';
import type { Pool } from 'types';
import type {
  BlockingBorrowPosition,
  ExtendedEModeAssetSettings,
  ExtendedEModeGroup,
} from '../../types';
import { ASSET_COLUMN_KEY } from '../useColumns';
import { EModeGroupCard } from './EModeGroupCard';
import { Header } from './Header';

export interface EModeGroupProps {
  pool: Pool;
  eModeGroup: ExtendedEModeGroup;
  columns: TableColumn<ExtendedEModeAssetSettings>[];
  initialOrder: Order<ExtendedEModeAssetSettings>;
  mobileOrder: Order<ExtendedEModeAssetSettings>;
  userHasEnoughCollateral: boolean;
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  hypotheticalUserHealthFactor: number;
}

export const EModeGroup: React.FC<EModeGroupProps> = ({
  eModeGroup,
  pool,
  columns,
  initialOrder,
  mobileOrder,
  userHasEnoughCollateral,
  userBlockingBorrowPositions,
  hypotheticalUserHealthFactor,
}) => {
  const formattedColumns = columns.map(column => {
    if (column.key === ASSET_COLUMN_KEY || eModeGroup.isActive) {
      return column;
    }

    // Grey out non-asset cells if E-mode group is inactive
    return {
      ...column,
      renderCell: (
        ...params: Parameters<TableColumn<ExtendedEModeAssetSettings>['renderCell']>
      ) => <span className="text-grey opacity-50">{column.renderCell(...params)}</span>,
    };
  });

  const getRowHref = (row: ExtendedEModeAssetSettings) =>
    routes.market.path
      .replace(':poolComptrollerAddress', pool.comptrollerAddress)
      .replace(':vTokenAddress', row.vToken.address);

  return (
    <>
      {/* Mobile/Tablet view */}
      <EModeGroupCard
        eModeGroup={eModeGroup}
        columns={formattedColumns}
        userHasEnoughCollateral={userHasEnoughCollateral}
        userBlockingBorrowPositions={userBlockingBorrowPositions}
        hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
        pool={pool}
        className="md:hidden"
        order={mobileOrder}
      />

      {/* Desktop view */}
      <Table
        className="hidden md:pt-0 md:block"
        columns={formattedColumns}
        data={eModeGroup.assetSettings}
        rowKeyExtractor={row => row.vToken.address}
        initialOrder={initialOrder}
        getRowHref={getRowHref}
        breakpoint="md"
        header={
          <div className="-mx-4">
            <Header
              pool={pool}
              eModeGroup={eModeGroup}
              userHasEnoughCollateral={userHasEnoughCollateral}
              userBlockingBorrowPositions={userBlockingBorrowPositions}
              hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
              className="p-4"
            />

            <Delimiter />
          </div>
        }
      />
    </>
  );
};
