import { Delimiter, type Order, Table, type TableColumn } from 'components';
import type { EModeAssetSettings, EModeGroup as EModeGroupType, Pool } from 'types';
import { EModeGroupCard } from './EModeGroupCard';
import { Header } from './Header';

export interface EModeGroupProps {
  pool: Pool;
  eModeGroup: EModeGroupType;
  columns: TableColumn<EModeAssetSettings>[];
  initialOrder: Order<EModeAssetSettings>;
  mobileOrder: Order<EModeAssetSettings>;
}

export const EModeGroup: React.FC<EModeGroupProps> = ({
  eModeGroup,
  pool,
  columns,
  initialOrder,
  mobileOrder,
}) => (
  <>
    {/* Mobile view */}
    <EModeGroupCard eModeGroup={eModeGroup} pool={pool} className="sm:hidden" order={mobileOrder} />

    {/* Tablet/desktop view */}
    <Table
      className="hidden sm:pt-0 sm:block"
      columns={columns}
      data={eModeGroup.assetSettings}
      rowKeyExtractor={row => row.vToken.address}
      initialOrder={initialOrder}
      breakpoint="sm"
      header={
        <div className="-mx-6">
          <Header pool={pool} eModeGroup={eModeGroup} className="px-6 py-4" />

          <Delimiter />
        </div>
      }
    />
  </>
);
