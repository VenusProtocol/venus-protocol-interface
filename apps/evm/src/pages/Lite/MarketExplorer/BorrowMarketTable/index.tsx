import { Table, type TableColumn, TokenIcon, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiteBorrowAsset, LiteBorrowMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { useMarketColumns } from '../useMarketColumns';

export interface BorrowMarketTableProps {
  borrowAsset: LiteBorrowAsset;
  onSelect: (market: LiteBorrowMarket) => void;
  header: React.ReactNode;
}

const VISIBLE_COLLATERAL_COUNT = 3;

export const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  borrowAsset,
  onSelect,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn } = useMarketColumns();
  const getMarketName = useMarketName();

  const columns: TableColumn<LiteBorrowMarket>[] = [
    {
      key: 'market',
      label: t('lite.columns.market'),
      selectOptionLabel: t('lite.columns.market'),
      sortRows: (rowA, rowB, direction) =>
        getMarketName(rowA).localeCompare(getMarketName(rowB)) * (direction === 'asc' ? 1 : -1),
      renderCell: market => (
        <button
          type="button"
          onClick={() => onSelect(market)}
          className="cursor-pointer text-left font-normal text-white hover:text-blue focus-visible:outline-2 focus-visible:outline-blue"
        >
          {getMarketName(market)}
        </button>
      ),
    },
    buildApyColumn<LiteBorrowMarket>({
      renderCell: market => (
        <span className="tabular-nums">{market.apyPercentage.toFixed(2)}%</span>
      ),
      sortRows: (rowA, rowB, direction) =>
        (rowA.apyPercentage.comparedTo(rowB.apyPercentage) ?? 0) * (direction === 'asc' ? 1 : -1),
    }),
    buildAmountColumn<LiteBorrowMarket>({
      key: 'liquidity',
      label: t('lite.columns.liquidity'),
      getTokens: market => market.liquidityTokens,
      getCents: market => market.liquidityCents,
      getToken: () => borrowAsset.token,
    }),
    {
      key: 'collateral',
      label: t('lite.columns.collateral'),
      selectOptionLabel: t('lite.columns.collateral'),
      align: 'right',
      sortRows: (rowA, rowB, direction) =>
        (rowA.collateralTokens.length - rowB.collateralTokens.length) *
        (direction === 'asc' ? 1 : -1),
      renderCell: market => (
        <div className="flex items-center justify-end gap-1">
          <div className="flex items-center -space-x-2">
            {market.collateralTokens.slice(0, VISIBLE_COLLATERAL_COUNT).map(token => (
              <Tooltip key={token.address} content={token.symbol}>
                <TokenIcon token={token} size="lg" className="shrink-0" />
              </Tooltip>
            ))}
          </div>

          {market.collateralTokens.length > VISIBLE_COLLATERAL_COUNT && (
            <Tooltip
              content={market.collateralTokens
                .slice(VISIBLE_COLLATERAL_COUNT)
                .map(token => token.symbol)
                .join(', ')}
            >
              <span className="text-b2r text-light-grey">
                +{market.collateralTokens.length - VISIBLE_COLLATERAL_COUNT}
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    buildAmountColumn<LiteBorrowMarket>({
      key: 'borrow',
      label: t('lite.columns.totalBorrow'),
      getTokens: market => market.borrowTokens,
      getCents: market => market.borrowCents,
      getToken: () => borrowAsset.token,
    }),
  ];

  return (
    <Table
      className="lite-table lite-table--wide"
      data={borrowAsset.markets}
      columns={columns}
      rowKeyExtractor={market => market.id}
      rowOnClick={(_event, market) => onSelect(market)}
      initialOrder={{ orderBy: columns[4], orderDirection: 'desc' }}
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
