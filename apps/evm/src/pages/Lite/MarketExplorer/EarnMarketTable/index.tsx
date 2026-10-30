import { Table, type TableColumn } from 'components';
import { useTranslation } from 'libs/translations';
import { MarketApy } from '../../MarketApy';
import type { LiteEarnAsset, LiteEarnMarket } from '../../types';
import { useMarketName } from '../../useMarketName';
import { useMarketColumns } from '../useMarketColumns';

export interface EarnMarketTableProps {
  earnAsset: LiteEarnAsset;
  onSelect: (market: LiteEarnMarket) => void;
  header: React.ReactNode;
}

export const EarnMarketTable: React.FC<EarnMarketTableProps> = ({
  earnAsset,
  onSelect,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, isMobile } = useMarketColumns();
  const getMarketName = useMarketName();

  const columns: TableColumn<LiteEarnMarket>[] = [
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
    buildApyColumn<LiteEarnMarket>({
      renderCell: market => <MarketApy source={market.source} />,
      secondary: { label: t('lite.columns.totalSupply'), getCents: market => market.supplyCents },
      sortRows: (rowA, rowB, direction) =>
        (rowA.apyPercentage.comparedTo(rowB.apyPercentage) ?? 0) * (direction === 'desc' ? -1 : 1),
    }),
    buildAmountColumn<LiteEarnMarket>({
      key: 'liquidity',
      label: t('lite.columns.liquidity'),
      getTokens: market => market.liquidityTokens,
      getCents: market => market.liquidityCents,
      getToken: () => earnAsset.token,
    }),
    buildAmountColumn<LiteEarnMarket>({
      key: 'supply',
      label: t('lite.columns.totalSupply'),
      getTokens: market => market.supplyTokens,
      getCents: market => market.supplyCents,
      getToken: () => earnAsset.token,
    }),
  ];

  return (
    <Table
      className="lite-table"
      data={earnAsset.markets}
      columns={isMobile ? columns.slice(0, 2) : columns}
      rowKeyExtractor={market => market.id}
      rowOnClick={(_event, market) => onSelect(market)}
      initialOrder={{ orderBy: columns[1], orderDirection: 'desc' }}
      tableLayout="auto"
      breakpoint={isMobile ? undefined : 'md'}
      hideCardDelimiter
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
