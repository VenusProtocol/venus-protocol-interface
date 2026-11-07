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
  const { buildAmountColumn, buildApyColumn, getTableProps } = useMarketColumns();
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
          className="cursor-pointer text-left font-normal text-primary group-hover:font-semibold hover:text-brand focus-visible:outline-2 focus-visible:outline-brand max-md:min-h-11"
        >
          {getMarketName(market)}
        </button>
      ),
    },
    buildApyColumn<LiteEarnMarket>({
      renderCell: market => <MarketApy source={market.source} className="flex-nowrap" />,
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
      data={earnAsset.markets}
      {...getTableProps({ columns, columnWidths: ['25%', '25%', '25%', '25%'] })}
      rowKeyExtractor={market => market.id}
      rowOnClick={(_event, market) => onSelect(market)}
      initialOrder={{ orderBy: columns[1], orderDirection: 'desc' }}
      header={header}
      placeholder={t('lite.placeholders.noMarkets')}
    />
  );
};
