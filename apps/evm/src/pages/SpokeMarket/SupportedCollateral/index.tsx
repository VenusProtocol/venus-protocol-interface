import { type Order, Table } from 'components';
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
  const suppliedColumn = columns.find(column => column.key === 'supplied');

  const initialOrder: Order<SpokeAsset> | undefined = suppliedColumn && {
    orderBy: suppliedColumn,
    orderDirection: 'desc',
  };

  return (
    <Table
      // +8px on the cells' 16px matches MarketCard's 24px
      className="px-2 py-6"
      title={t('spokeMarket.supportedCollateral.title')}
      data={collaterals}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      rowOnClick={(_event, asset) => onRowClick(asset)}
      initialOrder={initialOrder}
      cardListClassName="max-h-344 overflow-y-auto"
      tableContainerClassName="max-h-104 [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-background"
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      controls
    />
  );
};
