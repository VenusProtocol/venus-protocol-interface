import { Card, Delimiter, type Order } from 'components';
import type { EModeAssetSettings, EModeGroup, Pool } from 'types';
import type { BlockingBorrowPosition } from '../../types';
import { Header } from '../Header';
import { Asset } from './Asset';

export interface EModeGroupCardProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  order: Order<EModeAssetSettings>;
  userHasEnoughCollateral: boolean;
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  hypotheticalUserHealthFactor: number;
  className?: string;
}

export const EModeGroupCard: React.FC<EModeGroupCardProps> = ({
  eModeGroup,
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
        isEModeGroupActive={eModeGroup.isActive}
        className="border-lightGrey not-last-of-type:border-b not-last-of-type:pb-4"
        poolComptrollerAddress={pool.comptrollerAddress}
      />
    );

    return [...acc, dom];
  }, []);

  return (
    <Card className={className}>
      <div className="-mx-4 mb-4">
        <Header
          pool={pool}
          eModeGroup={eModeGroup}
          userHasEnoughCollateral={userHasEnoughCollateral}
          userBlockingBorrowPositions={userBlockingBorrowPositions}
          hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
          className="px-4 pb-4"
        />

        <Delimiter />
      </div>

      <div className="space-y-4">{listItemsDom}</div>
    </Card>
  );
};
