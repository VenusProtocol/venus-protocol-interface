import { Card, type Order, type TableColumn } from 'components';
import type { EModeAssetSettings, EModeGroup, Pool } from 'types';
import type { BlockingBorrowPosition } from '../../../types';
import { Header } from '../Header';
import { Asset } from './Asset';

export interface EModeGroupCardProps {
  pool: Pool;
  columns: TableColumn<EModeAssetSettings>[];
  eModeGroup: EModeGroup;
  order: Order<EModeAssetSettings>;
  userHasEnoughCollateral: boolean;
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  hypotheticalUserHealthFactor: number;
  className?: string;
}

export const EModeGroupCard: React.FC<EModeGroupCardProps> = ({
  eModeGroup,
  columns,
  pool,
  className,
  userHasEnoughCollateral,
  userBlockingBorrowPositions,
  hypotheticalUserHealthFactor,
  order,
}) => {
  const sortedEModeAssetSettings = order.orderBy.sortRows
    ? [...eModeGroup.assetSettings].sort((rowA, rowB) =>
        order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
      )
    : eModeGroup.assetSettings;

  const listItemsDom = sortedEModeAssetSettings.reduce<React.ReactNode[]>((acc, settings) => {
    const dom = (
      <Asset
        key={settings.vToken.address}
        eModeAssetSettings={settings}
        columns={columns}
        isEModeGroupActive={eModeGroup.isActive}
        className="border-lightGrey not-last-of-type:border-b not-last-of-type:pb-4"
        poolComptrollerAddress={pool.comptrollerAddress}
      />
    );

    return [...acc, dom];
  }, []);

  return (
    <Card className={className}>
      <Header
        pool={pool}
        eModeGroup={eModeGroup}
        userHasEnoughCollateral={userHasEnoughCollateral}
        userBlockingBorrowPositions={userBlockingBorrowPositions}
        hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
        className="mb-4"
      />

      <div className="space-y-4">{listItemsDom}</div>
    </Card>
  );
};
