import { ImgGroupTooltip, type TableColumn, TokenIconWithSymbol } from 'components';
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
    <ImgGroupTooltip
      imgSrcs={collaterals.map(({ token }) => token.iconSrc)}
      data={collaterals}
      rowKeyExtractor={row => row.token.address}
      columns={columns}
      tableLayout="auto"
      className={className}
      contentClassName="max-w-none"
    />
  );
};
