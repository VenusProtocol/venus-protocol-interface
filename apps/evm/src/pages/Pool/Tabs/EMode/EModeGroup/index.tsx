import { Delimiter, type Order, Table, type TableColumn } from 'components';
import { routes } from 'constants/routing';
import type { EModeAssetSettings, EModeGroup as EModeGroupType, Pool } from 'types';
import type { BlockingBorrowPosition } from '../types';
import { EModeGroupCard } from './EModeGroupCard';
import { Header } from './Header';

export interface EModeGroupProps {
  pool: Pool;
  eModeGroup: EModeGroupType;
  columns: TableColumn<EModeAssetSettings>[];
  initialOrder: Order<EModeAssetSettings>;
  mobileOrder: Order<EModeAssetSettings>;
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
  const getRowHref = (row: EModeAssetSettings) =>
    routes.market.path
      .replace(':poolComptrollerAddress', pool.comptrollerAddress)
      .replace(':vTokenAddress', row.vToken.address);

  return (
    <>
      {/* Mobile view */}
      <EModeGroupCard
        eModeGroup={eModeGroup}
        userHasEnoughCollateral={userHasEnoughCollateral}
        userBlockingBorrowPositions={userBlockingBorrowPositions}
        hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
        pool={pool}
        className="sm:hidden"
        order={mobileOrder}
      />

      {/* Tablet/desktop view */}
      <Table
        className="hidden sm:pt-0 sm:block"
        columns={columns}
        data={eModeGroup.assetSettings}
        rowKeyExtractor={row => row.vToken.address}
        initialOrder={initialOrder}
        getRowHref={getRowHref}
        breakpoint="sm"
        header={
          <div className="-mx-6">
            <Header
              pool={pool}
              eModeGroup={eModeGroup}
              userHasEnoughCollateral={userHasEnoughCollateral}
              userBlockingBorrowPositions={userBlockingBorrowPositions}
              hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
              className="px-6 py-4"
            />

            <Delimiter />
          </div>
        }
      />
    </>
  );
};
