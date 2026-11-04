import { SpokeCollateralGroup, Table, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset, SpokeAsset } from 'types';
import { BorrowMarketApy } from '../../BorrowMarketApy';
import type { LiteBorrowAsset, LiteBorrowMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { useMarketColumns } from '../useMarketColumns';

export interface BorrowMarketTableProps {
  borrowAsset: LiteBorrowAsset;
  markets: LiteBorrowMarket[];
  onSelect: (market: LiteBorrowMarket) => void;
  onSelectCollateral: (input: { market: LiteBorrowMarket; asset: SpokeAsset }) => void;
  onSelectCoreCollateral: (input: { market: LiteBorrowMarket; asset: Asset }) => void;
  header: React.ReactNode;
}

export const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  borrowAsset,
  markets,
  onSelect,
  onSelectCollateral,
  onSelectCoreCollateral,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, getTableProps, isMobile } = useMarketColumns();
  const getMarketName = useMarketName();

  const renderCollaterals = (market: LiteBorrowMarket) =>
    market.source.type === 'spoke' ? (
      <SpokeCollateralGroup
        collaterals={market.source.collaterals}
        onRowClick={asset => onSelectCollateral({ market, asset })}
      />
    ) : (
      <SpokeCollateralGroup
        collaterals={market.source.collaterals}
        onRowClick={asset => onSelectCoreCollateral({ market, asset })}
      />
    );

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
            className="cursor-pointer text-left font-normal text-white group-hover:font-bold hover:text-blue focus-visible:outline-2 focus-visible:outline-blue max-md:min-h-11"
          >
            {getMarketName(market)}
          </button>

          {isMobile && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-grey">
              <span>{t('lite.columns.collateral')}</span>

              {renderCollaterals(market)}
            </div>
          )}
        </div>
      ),
    },
    buildApyColumn<LiteBorrowMarket>({
      renderCell: market => <BorrowMarketApy source={market.source} />,
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
        (rowA.source.collaterals.length - rowB.source.collaterals.length) *
        (direction === 'asc' ? 1 : -1),
      renderCell: renderCollaterals,
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
      data={markets}
      {...getTableProps({ columns, columnWidths: ['25%', '15%', '22%', '16%', '22%'] })}
      rowKeyExtractor={market => market.id}
      rowOnClick={(_event, market) => onSelect(market)}
      initialOrder={{ orderBy: columns[1], orderDirection: 'asc' }}
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
