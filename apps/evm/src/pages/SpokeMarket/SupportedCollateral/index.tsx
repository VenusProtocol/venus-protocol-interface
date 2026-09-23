import { Table } from 'components';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';

import { useColumns } from './useColumns';

export interface SupportedCollateralProps {
  collaterals: SpokeAsset[];
  onRowClick: (collateral: SpokeAsset) => void;
}

export const SupportedCollateral: React.FC<SupportedCollateralProps> = ({
  collaterals,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const columns = useColumns();

  return (
    <Table
      // +8px on the cells' 16px matches MarketCard's 24px
      className="px-2 py-6"
      title={t('spokeMarket.supportedCollateral.title')}
      data={collaterals}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      rowOnClick={(_event, asset) => onRowClick(asset)}
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      controls
    />
  );
};
