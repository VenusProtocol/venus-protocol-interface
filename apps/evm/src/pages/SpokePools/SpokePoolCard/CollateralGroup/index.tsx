import { cn } from '@venusprotocol/ui';

import { ImgGroup, Table, type TableColumn, TokenIconWithSymbol, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface CollateralGroupProps {
  collaterals: SpokeAsset[];
  className?: string;
}

export const CollateralGroup: React.FC<CollateralGroupProps> = ({ collaterals, className }) => {
  const { t } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'asset',
      label: t('spokePools.collateralGroup.asset'),
      selectOptionLabel: t('spokePools.collateralGroup.asset'),
      renderCell: collateral => <TokenIconWithSymbol token={collateral.vToken.underlyingToken} />,
    },
    {
      key: 'maxLtv',
      label: t('spokePools.collateralGroup.maxLtv'),
      selectOptionLabel: t('spokePools.collateralGroup.maxLtv'),
      align: 'right',
      renderCell: collateral => formatPercentageToReadableValue(collateral.collateralFactor * 100),
    },
  ];

  return (
    <Tooltip
      content={
        <Table
          data={collaterals}
          rowKeyExtractor={row => row.vToken.address}
          columns={columns}
          variant="secondary"
          tableLayout="auto"
          className="border-0 p-0"
          tableRowClassName="h-12"
          tableHeaderClassName="h-12"
        />
      }
      className={cn('inline-flex', className)}
      contentClassName="max-w-none p-0 max-h-49 overflow-y-auto"
    >
      <ImgGroup
        imgSrcs={collaterals.map(({ vToken }) => vToken.underlyingToken.iconSrc)}
        removeDuplicates
        limit={5}
      />
    </Tooltip>
  );
};
