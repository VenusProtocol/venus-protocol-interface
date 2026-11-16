import { Table } from 'components';
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

  return (
    <Table
      className="py-6"
      size="compact"
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
