import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { BorrowMarketApy } from '../../BorrowMarketApy';
import { getLowestApyMarket } from '../../getLowestApyMarket';
import { getLowestBorrowApyPercentage } from '../../getLowestBorrowApyPercentage';
import type { LiteBorrowAsset } from '../../types';
import { EmptyState } from '../EmptyState';
import { useMarketColumns } from '../useMarketColumns';

export interface BorrowAssetTableProps {
  borrowAssets: LiteBorrowAsset[];
  isFetching: boolean;
  isReady: boolean;
  onSelect: (borrowAsset: LiteBorrowAsset) => void;
  header: React.ReactNode;
  searchValue: string;
  onClearFilters?: () => void;
}

export const BorrowAssetTable: React.FC<BorrowAssetTableProps> = ({
  borrowAssets,
  isFetching,
  isReady,
  onSelect,
  header,
  searchValue,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, getTableProps } = useMarketColumns();

  const query = searchValue.trim();
  let placeholder: React.ReactNode;

  if (!isFetching) {
    placeholder = isReady ? (
      <EmptyState
        showIcon
        title={
          query
            ? t('lite.placeholders.noResults', { query })
            : t('lite.placeholders.noBorrowableAssets')
        }
        hint={onClearFilters && t('lite.placeholders.tryAnotherSymbol')}
        onClear={onClearFilters}
      />
    ) : (
      <EmptyState
        title={t('lite.placeholders.unavailable')}
        hint={t('lite.placeholders.refresh')}
      />
    );
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
          <TokenIconWithSymbol
            token={borrowAsset.token}
            size="xl"
            symbolClassName="font-normal group-hover:font-semibold"
          />
        </button>
      ),
    },
    buildApyColumn<LiteBorrowAsset>({
      renderCell: borrowAsset => (
        <BorrowMarketApy source={getLowestApyMarket(borrowAsset).source} showBadgeOnly />
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
      data={isReady ? borrowAssets : []}
      {...getTableProps({ columns, columnWidths: ['25%', '25%', '25%', '25%'] })}
      rowKeyExtractor={borrowAsset => borrowAsset.key}
      rowOnClick={(_event, borrowAsset) => onSelect(borrowAsset)}
      initialOrder={{ orderBy: columns[3], orderDirection: 'desc' }}
      isFetching={isFetching}
      header={header}
      placeholder={placeholder}
    />
  );
};
