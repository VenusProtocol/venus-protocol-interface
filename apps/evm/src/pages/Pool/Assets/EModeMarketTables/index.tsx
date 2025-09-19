import { MarketTable, type MarketTableProps } from 'containers/MarketTable';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';

export interface EModeMarketTablesProps extends MarketTableProps {}

export const EModeMarketTables: React.FC<EModeMarketTablesProps> = ({
  assets,
  poolUserEModeGroup,
  header,
  ...marketTableProps
}) => {
  const { t } = useTranslation();

  const eModeVTokenAddresses = (poolUserEModeGroup?.assetSettings || []).map(a =>
    a.vToken.address.toLowerCase(),
  );
  const eModeAssets: Asset[] = [];
  const nonEModeAssets: Asset[] = [];

  assets.forEach(asset => {
    if (eModeVTokenAddresses.includes(asset.vToken.address.toLowerCase())) {
      eModeAssets.push(asset);
    } else {
      nonEModeAssets.push(asset);
    }
  });

  return (
    <div className="space-y-6 lg:space-y-4 xl:space-y-6">
      {/* // TODO: add controls */}

      <MarketTable
        {...marketTableProps}
        controls={false}
        showMobileFilter={false}
        poolUserEModeGroup={poolUserEModeGroup}
        header={header}
        assets={eModeAssets}
      />

      <div className="space-y-4">
        <p className="text-lg lg:hidden">{t('pool.eMode.nonEModeTable.title')}</p>

        <MarketTable
          {...marketTableProps}
          controls={false}
          showMobileFilter={false}
          poolUserEModeGroup={poolUserEModeGroup}
          assets={nonEModeAssets}
        />
      </div>
    </div>
  );
};
