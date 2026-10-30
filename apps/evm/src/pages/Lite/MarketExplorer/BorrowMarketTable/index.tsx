import { Table, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import type { LiteBorrowAsset, LiteBorrowMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { useMarketColumns } from '../useMarketColumns';
import { CollateralIcons } from './CollateralIcons';

export interface BorrowMarketTableProps {
  borrowAsset: LiteBorrowAsset;
  onSelect: (market: LiteBorrowMarket) => void;
  onSelectCollateral: (input: { market: LiteBorrowMarket; token: Token }) => void;
  header: React.ReactNode;
}

export const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  borrowAsset,
  onSelect,
  onSelectCollateral,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, isMobile } = useMarketColumns();
  const getMarketName = useMarketName();

  const columns: TableColumn<LiteBorrowMarket>[] = [
    {
      key: 'pool',
      label: t('lite.columns.pool'),
      selectOptionLabel: t('lite.columns.pool'),
      sortRows: (rowA, rowB, direction) =>
        getMarketName(rowA).localeCompare(getMarketName(rowB)) * (direction === 'asc' ? 1 : -1),
      renderCell: market => (
        <div>
          <button
            type="button"
            onClick={() => onSelect(market)}
            className="cursor-pointer text-left font-normal text-white hover:text-blue focus-visible:outline-2 focus-visible:outline-blue"
          >
            {getMarketName(market)}
          </button>

          {isMobile && (
            <div className="lite-mobile-collateral-trigger">
              <span>{t('lite.columns.collateral')}</span>

              <CollateralIcons
                market={market}
                onSelect={onSelectCollateral}
                className="flex items-center gap-1"
              />
            </div>
          )}
        </div>
      ),
    },
    buildApyColumn<LiteBorrowMarket>({
      renderCell: market => (
        <span className="tabular-nums">{market.apyPercentage.toFixed(2)}%</span>
      ),
      secondary: { label: t('lite.columns.liquidity'), getCents: market => market.liquidityCents },
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
        <CollateralIcons
          market={market}
          onSelect={onSelectCollateral}
          className="flex items-center justify-end gap-1"
        />
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
      columns={isMobile ? columns.slice(0, 2) : columns}
      rowKeyExtractor={market => market.id}
      rowOnClick={(_event, market) => onSelect(market)}
      initialOrder={{ orderBy: columns[1], orderDirection: 'asc' }}
      tableLayout="auto"
      breakpoint={isMobile ? undefined : 'md'}
      hideCardDelimiter
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
