import { Table, type TableColumn, TokenIcon, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import type { LiteBorrowAsset, LiteBorrowMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { useMarketColumns } from '../useMarketColumns';

export interface BorrowMarketTableProps {
  borrowAsset: LiteBorrowAsset;
  onSelect: (market: LiteBorrowMarket) => void;
  onSelectCollateral: (input: { market: LiteBorrowMarket; token: Token }) => void;
  header: React.ReactNode;
}

const VISIBLE_COLLATERAL_COUNT = 3;

export const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  borrowAsset,
  onSelect,
  onSelectCollateral,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn } = useMarketColumns();
  const getMarketName = useMarketName();

  const columns: TableColumn<LiteBorrowMarket>[] = [
    {
      key: 'pool',
      label: t('lite.columns.pool'),
      selectOptionLabel: t('lite.columns.pool'),
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
                <button
                  type="button"
                  aria-label={t('lite.collateralAriaLabel', { symbol: token.symbol })}
                  className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-blue"
                  onClick={event => {
                    event.stopPropagation();
                    onSelectCollateral({ market, token });
                  }}
                >
                  <TokenIcon token={token} size="lg" className="shrink-0" />
                </button>
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
      initialOrder={{ orderBy: columns[1], orderDirection: 'asc' }}
      tableLayout="auto"
      breakpoint="md"
      hideCardDelimiter
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
