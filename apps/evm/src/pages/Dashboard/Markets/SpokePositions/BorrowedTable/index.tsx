import {
  Apy,
  LayeredValues,
  ProgressBar,
  Table,
  type TableColumn,
  TokenIconWithSymbol,
} from 'components';
import { useTranslation } from 'libs/translations';
import type { SpokeAsset, SpokePool } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

export interface BorrowedTableProps {
  spokePool: SpokePool;
  loanAssets: SpokeAsset[];
  onRowClick: (asset: SpokeAsset) => void;
}

export const BorrowedTable: React.FC<BorrowedTableProps> = ({
  spokePool,
  loanAssets,
  onRowClick,
}) => {
  const { t } = useTranslation();

  const borrowLimitCents = spokePool.userBorrowLimitCents;

  const getLimitSharePercentage = (asset: SpokeAsset) =>
    borrowLimitCents?.isGreaterThan(0)
      ? asset.userBorrowBalanceCents.dividedBy(borrowLimitCents).multipliedBy(100).toNumber()
      : 0;

  const columns: TableColumn<SpokeAsset>[] = [
    {
      key: 'asset',
      label: t('account.spoke.borrowed.columns.asset'),
      selectOptionLabel: t('account.spoke.borrowed.columns.asset'),
      renderCell: asset => <TokenIconWithSymbol token={asset.vToken.underlyingToken} />,
    },
    {
      key: 'apy',
      label: t('account.spoke.borrowed.columns.apy'),
      selectOptionLabel: t('account.spoke.borrowed.columns.apy'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.borrowApyPercentage, rowB.borrowApyPercentage, direction),
      renderCell: asset => (
        <Apy
          type="borrow"
          token={asset.vToken.underlyingToken}
          baseApyPercentage={asset.borrowApyPercentage}
          tokenDistributions={asset.borrowTokenDistributions}
          userBalanceTokens={asset.userBorrowBalanceTokens}
        />
      ),
    },
    {
      key: 'balance',
      label: t('account.spoke.borrowed.columns.balance'),
      selectOptionLabel: t('account.spoke.borrowed.columns.balance'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.userBorrowBalanceCents, rowB.userBorrowBalanceCents, direction),
      renderCell: asset => (
        <LayeredValues
          topValue={formatTokensToReadableValue({
            value: asset.userBorrowBalanceTokens,
            token: asset.vToken.underlyingToken,
            addSymbol: false,
          })}
          bottomValue={formatCentsToReadableValue({ value: asset.userBorrowBalanceCents })}
        />
      ),
    },
    {
      key: 'limitShare',
      label: t('account.spoke.borrowed.columns.limitShare'),
      selectOptionLabel: t('account.spoke.borrowed.columns.limitShare'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        compareBigNumbers(rowA.userBorrowBalanceCents, rowB.userBorrowBalanceCents, direction),
      renderCell: asset => (
        <div className="flex items-center justify-end gap-x-2">
          <ProgressBar
            min={0}
            max={100}
            progressBars={[{ value: getLimitSharePercentage(asset) }]}
            className="w-16"
          />

          <span className="text-b1r">
            {formatPercentageToReadableValue(getLimitSharePercentage(asset))}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Table
      title={t('account.spoke.borrowed.title')}
      data={loanAssets}
      columns={columns}
      rowKeyExtractor={asset => asset.vToken.address}
      rowOnClick={(_event, asset) => onRowClick(asset)}
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
    />
  );
};
