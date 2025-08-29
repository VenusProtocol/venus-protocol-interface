import { Card, Delimiter, type Order } from 'components';
import type { EModeAssetSettings, EModeGroup, Pool } from 'types';
import { Header } from '../Header';
import { Asset } from './Asset';

export interface EModeGroupCardProps {
  pool: Pool;
  eModeGroup: EModeGroup;
  order: Order<EModeAssetSettings>;
  className?: string;
}

export const EModeGroupCard: React.FC<EModeGroupCardProps> = ({
  eModeGroup,
  pool,
  className,
  order,
}) => {
  const sortedEModeAssetSettings = order.orderBy.sortRows
    ? [...eModeGroup.assetSettings].sort((rowA, rowB) =>
        order.orderBy.sortRows!(rowA, rowB, order.orderDirection),
      )
    : eModeGroup.assetSettings;

  return (
    <Card className={className}>
      <div className="-mx-4 mb-4">
        <Header pool={pool} eModeGroup={eModeGroup} className="px-6 pb-4" />

        <Delimiter />
      </div>

      <div className="space-y-4">
        {sortedEModeAssetSettings.map(settings => (
          <Asset
            key={settings.vToken.address}
            eModeAssetSettings={settings}
            className="border-lightGrey [&:not(:last-of-type)]:border-b [&:not(:last-of-type)]:pb-4"
          />
        ))}
      </div>
    </Card>
  );
};
