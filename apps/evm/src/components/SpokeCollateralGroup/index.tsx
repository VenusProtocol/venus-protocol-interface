import { ImgGroupTooltip } from 'components/ImgGroupTooltip';
import type { TableColumn } from 'components/Table';
import { TokenIconWithSymbol } from 'components/TokenIconWithSymbol';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface SpokeCollateralGroupProps {
  collaterals: SpokeAsset[];
  onRowClick?: (collateral: SpokeAsset) => void;
  className?: string;
}

export const SpokeCollateralGroup: React.FC<SpokeCollateralGroupProps> = ({
  collaterals,
  onRowClick,
  className,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'asset',
      label: t('spokeCollateralGroup.asset'),
      selectOptionLabel: t('spokeCollateralGroup.asset'),
      renderCell: collateral => <TokenIconWithSymbol token={collateral.vToken.underlyingToken} />,
    },
    {
      key: 'maxLtv',
      label: t('spokeCollateralGroup.maxLtv'),
      selectOptionLabel: t('spokeCollateralGroup.maxLtv'),
      align: 'right',
      renderCell: collateral => formatPercentageToReadableValue(collateral.collateralFactor * 100),
    },
  ];

  return (
    <ImgGroupTooltip
      imgs={collaterals.map(({ vToken }) => ({
        src: vToken.underlyingToken.iconSrc,
        alt: vToken.underlyingToken.symbol,
      }))}
      data={collaterals}
      rowKeyExtractor={row => row.vToken.address}
      rowOnClick={onRowClick && ((_event, collateral) => onRowClick(collateral))}
      getRowClassName={onRowClick && (() => 'cursor-pointer')}
      columns={columns}
      tableLayout="auto"
      removeDuplicates
      className={className}
      contentClassName="max-w-none"
    />
  );
};
