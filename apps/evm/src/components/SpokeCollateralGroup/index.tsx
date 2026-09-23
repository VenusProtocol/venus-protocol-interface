import { cn } from '@venusprotocol/ui';

import { ImgGroupTooltip } from 'components/ImgGroupTooltip';
import { InfoIcon } from 'components/InfoIcon';
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
      renderCell: collateral => (
        <div className="flex items-center gap-x-2">
          <TokenIconWithSymbol token={collateral.vToken.underlyingToken} />

          {collateral.isInactive && (
            <InfoIcon
              iconClassName="text-orange"
              iconName="attention"
              tooltip={t('marketTable.assetColumn.pausedAssetTooltip')}
            />
          )}
        </div>
      ),
    },
    {
      key: 'maxLtv',
      label: t('spokeCollateralGroup.maxLtv'),
      selectOptionLabel: t('spokeCollateralGroup.maxLtv'),
      align: 'right',
      renderCell: collateral => (
        <span className={cn(collateral.isInactive && 'text-grey')}>
          {formatPercentageToReadableValue(collateral.collateralFactor * 100)}
        </span>
      ),
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
