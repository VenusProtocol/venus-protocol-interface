import {
  LayeredValues,
  ProtectionModeIndicator,
  Table,
  type TableColumn,
  TokenIconWithSymbol,
} from 'components';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface SuppliedTableProps {
  collaterals: SpokeAsset[];
  onRowClick: (asset: SpokeAsset) => void;
}

export const SuppliedTable: React.FC<SuppliedTableProps> = ({ collaterals, onRowClick }) => {
  const { t } = useTranslation();

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'asset',
      label: t('account.spoke.supplied.columns.asset'),
      selectOptionLabel: t('account.spoke.supplied.columns.asset'),
      renderCell: asset => (
        <div className="flex items-center gap-x-2">
          <TokenIconWithSymbol
            token={asset.vToken.underlyingToken}
            size="xl"
            symbolClassName="font-normal group-hover:font-semibold"
          />

          {asset.isProtectionModeEnabled && (
            <ProtectionModeIndicator
              variant="icon"
              tooltipType="supply"
              tokenName={asset.vToken.underlyingToken.symbol}
              userSupplyBalanceCents={asset.userSupplyBalanceProtectedCents}
            />
          )}
        </div>
      ),
    },
    {
      key: 'maxLtv',
      label: t('account.spoke.supplied.columns.maxLtv'),
      selectOptionLabel: t('account.spoke.supplied.columns.maxLtv'),
      align: 'right',
      renderCell: asset => formatPercentageToReadableValue(asset.collateralFactor * 100),
    },
    {
      key: 'liquidationThreshold',
      label: t('account.spoke.supplied.columns.liquidationThreshold'),
      selectOptionLabel: t('account.spoke.supplied.columns.liquidationThreshold'),
      align: 'right',
      renderCell: asset => formatPercentageToReadableValue(asset.liquidationThresholdPercentage),
    },
    {
      key: 'balance',
      label: t('account.spoke.supplied.columns.balance'),
      selectOptionLabel: t('account.spoke.supplied.columns.balance'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.userSupplyBalanceCents, rowB.userSupplyBalanceCents, direction),
      renderCell: asset => (
        <HidableUserBalance>
          <LayeredValues
            topValue={formatTokensToReadableValue({
              value: asset.userSupplyBalanceTokens,
              token: asset.vToken.underlyingToken,
              addSymbol: false,
            })}
            bottomValue={formatCentsToReadableValue({ value: asset.userSupplyBalanceCents })}
          />
        </HidableUserBalance>
      ),
    },
  ];

  return (
    <Table
      className="pt-4"
      title={t('account.spoke.supplied.title')}
      data={collaterals}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      rowOnClick={(_event, asset) => onRowClick(asset)}
      columnWidths={['24%', '32%', '20%', '24%']}
      tableHeaderClassName="border-subtle"
      tableRowClassName="h-15 hover:bg-table-row-hover"
      breakpoint="md"
      hideCardDelimiter
    />
  );
};
