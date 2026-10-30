import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { getLowestBorrowApyPercentage } from '../../getLowestBorrowApyPercentage';
import type { LiteBorrowAsset } from '../../types';
import { useMarketColumns } from '../useMarketColumns';

export interface BorrowAssetTableProps {
  borrowAssets: LiteBorrowAsset[];
  isFetching: boolean;
  isReady: boolean;
  onSelect: (borrowAsset: LiteBorrowAsset) => void;
  header: React.ReactNode;
}

export const BorrowAssetTable: React.FC<BorrowAssetTableProps> = ({
  borrowAssets,
  isFetching,
  isReady,
  onSelect,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, isMobile } = useMarketColumns();

  let placeholder: string | undefined;

  if (!isFetching) {
    placeholder = isReady
      ? t('lite.placeholders.noBorrowableAssets')
      : t('lite.placeholders.unavailable');
  }

  const columns: TableColumn<LiteBorrowAsset>[] = [
    {
      key: 'loan',
      label: t('lite.columns.loan'),
      selectOptionLabel: t('lite.columns.loan'),
      renderCell: borrowAsset => (
        <button
          type="button"
          onClick={() => onSelect(borrowAsset)}
          aria-label={t('lite.assetAriaLabel', { symbol: borrowAsset.token.symbol })}
          className="cursor-pointer text-left hover:text-blue focus-visible:outline-2 focus-visible:outline-blue"
        >
          <TokenIconWithSymbol token={borrowAsset.token} size="xl" />
        </button>
      ),
    },
    buildApyColumn<LiteBorrowAsset>({
      renderCell: borrowAsset => (
        <span className="tabular-nums">
          {getLowestBorrowApyPercentage(borrowAsset).toFixed(2)}%
        </span>
      ),
      secondary: {
        label: t('lite.columns.totalBorrow'),
        getCents: borrowAsset => borrowAsset.borrowCents,
      },
      sortRows: (rowA, rowB, direction) =>
        (getLowestBorrowApyPercentage(rowA).comparedTo(getLowestBorrowApyPercentage(rowB)) ?? 0) *
        (direction === 'asc' ? 1 : -1),
    }),
    buildAmountColumn<LiteBorrowAsset>({
      key: 'liquidity',
      label: t('lite.columns.liquidity'),
      getTokens: borrowAsset => borrowAsset.liquidityTokens,
      getCents: borrowAsset => borrowAsset.liquidityCents,
      getToken: borrowAsset => borrowAsset.token,
    }),
    buildAmountColumn<LiteBorrowAsset>({
      key: 'borrow',
      label: t('lite.columns.totalBorrow'),
      getTokens: borrowAsset => borrowAsset.borrowTokens,
      getCents: borrowAsset => borrowAsset.borrowCents,
      getToken: borrowAsset => borrowAsset.token,
    }),
  ];

  return (
    <Table
      className="lite-table"
      data={isReady ? borrowAssets : []}
      columns={isMobile ? columns.slice(0, 2) : columns}
      rowKeyExtractor={borrowAsset => borrowAsset.key}
      rowOnClick={(_event, borrowAsset) => onSelect(borrowAsset)}
      initialOrder={{ orderBy: columns[3], orderDirection: 'desc' }}
      isFetching={isFetching}
      tableLayout="auto"
      breakpoint={isMobile ? undefined : 'md'}
      hideCardDelimiter
      header={header}
      placeholder={placeholder}
    />
  );
};
