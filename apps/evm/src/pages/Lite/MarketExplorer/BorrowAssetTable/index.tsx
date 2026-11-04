import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { BorrowMarketApy } from '../../BorrowMarketApy';
import { getLowestApyMarket } from '../../getLowestApyMarket';
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
  const { buildAmountColumn, buildApyColumn, getTableProps } = useMarketColumns();

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
          <TokenIconWithSymbol
            token={borrowAsset.token}
            size="xl"
            symbolClassName="font-normal group-hover:font-bold"
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
