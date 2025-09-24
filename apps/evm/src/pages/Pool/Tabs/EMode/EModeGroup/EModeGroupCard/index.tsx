import { Card, Delimiter, type Order } from 'components';
import type { Asset as AssetType, EModeAssetSettings, EModeGroup, Pool } from 'types';
import { areTokensEqual } from 'utilities';
import { Header } from '../Header';
import { Asset } from './Asset';

export interface EModeGroupCardProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  order: Order<EModeAssetSettings>;
  userHasEnoughCollateral: boolean;
  userBlockingAssets: AssetType[];
  hypotheticalUserHealthFactor: number;
  className?: string;
}

export const EModeGroupCard: React.FC<EModeGroupCardProps> = ({
  eModeGroup,
  pool,
  className,
  userHasEnoughCollateral,
  userBlockingAssets,
  hypotheticalUserHealthFactor,
  order,
}) => {
  const sortedEModeAssetSettings = order.orderBy.sortRows
    ? [...eModeGroup.assetSettings].sort((rowA, rowB) =>
        order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
      )
    : eModeGroup.assetSettings;

  const listItemsDom = sortedEModeAssetSettings.reduce<React.ReactNode[]>((acc, settings) => {
    const asset = pool.assets.find(asset => areTokensEqual(asset.vToken, settings.vToken));

    if (!asset) {
      return acc;
    }

    const dom = (
      <Asset
        key={settings.vToken.address}
        eModeAssetSettings={settings}
        className="border-lightGrey [&:not(:last-of-type)]:border-b [&:not(:last-of-type)]:pb-4"
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
          userBlockingAssets={userBlockingAssets}
          hypotheticalUserHealthFactor={hypotheticalUserHealthFactor}
          className="px-4 pb-4"
        />

        <Delimiter />
      </div>

      <div className="space-y-4">{listItemsDom}</div>
    </Card>
  );
};
