import { type Order, Table } from 'components';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import type { Address } from 'viem';

import { useColumns } from './useColumns';

export interface SupportedCollateralProps {
  collaterals: SpokeAsset[];
  onRowClick: (collateral: SpokeAsset) => void;
  comptrollerAddress: Address;
}

export const SupportedCollateral: React.FC<SupportedCollateralProps> = ({
  collaterals,
  onRowClick,
  comptrollerAddress,
}) => {
  const { t } = useTranslation();
  const columns = useColumns({ comptrollerAddress });
  const suppliedColumn = columns.find(column => column.key === 'supplied');

  const initialOrder: Order<SpokeAsset> | undefined = suppliedColumn && {
    orderBy: suppliedColumn,
    orderDirection: 'desc',
  };

  return (
    <Table
      className="py-6"
      size="compact"
      title={t('spokeMarket.supportedCollateral.title')}
      data={collaterals}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      rowOnClick={(_event, asset) => onRowClick(asset)}
      initialOrder={initialOrder}
      maxVisibleCardCount={5}
      tableContainerClassName="max-h-104 [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-surface-2"
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      controls
    />
  );
};
