import { cn } from '@venusprotocol/ui';

import { ImgGroup, Table, type TableColumn, TokenIconWithSymbol, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHubSourceCollateral } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface CollateralGroupProps {
  collaterals: LiquidityHubSourceCollateral[];
  className?: string;
}

export const CollateralGroup: React.FC<CollateralGroupProps> = ({ collaterals, className }) => {
  const { t } = useTranslation();

  const columns: TableColumn<LiquidityHubSourceCollateral>[] = [
    {
      label: t('liquidityHub.allocationDetails.yieldGroup.collateralColumn.group.asset'),
      selectOptionLabel: t(
        'liquidityHub.allocationDetails.yieldGroup.collateralColumn.group.asset',
      ),
      key: 'asset',
      renderCell: collateral => <TokenIconWithSymbol token={collateral.token} />,
    },
    {
      label: t(
        'liquidityHub.allocationDetails.yieldGroup.collateralColumn.group.liquidationThreshold',
      ),
      selectOptionLabel: t(
        'liquidityHub.allocationDetails.yieldGroup.collateralColumn.group.liquidationThreshold',
      ),
      key: 'liquidationThreshold',
      align: 'right',
      renderCell: collateral =>
        formatPercentageToReadableValue(collateral.liquidationThresholdPercentage),
    },
  ];

  return (
    <Tooltip
      content={
        <Table
          data={collaterals}
          rowKeyExtractor={row => row.token.address}
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
      <ImgGroup imgSrcs={collaterals.map(({ token }) => token.iconSrc)} limit={5} />
    </Tooltip>
  );
};
