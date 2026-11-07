import BigNumber from 'bignumber.js';
import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import { MarketApy } from '../../MarketApy';
import { getHighestApyMarket } from '../../getHighestApyMarket';
import type { LiteEarnAsset } from '../../types';
import { useMarketColumns } from '../useMarketColumns';

export interface EarnAssetTableProps {
  earnAssets: LiteEarnAsset[];
  isFetching: boolean;
  isReady: boolean;
  onSelect: (earnAsset: LiteEarnAsset) => void;
  header: React.ReactNode;
}

export const EarnAssetTable: React.FC<EarnAssetTableProps> = ({
  earnAssets,
  isFetching,
  isReady,
  onSelect,
  header,
}) => {
  const { t } = useTranslation();
  const { buildAmountColumn, buildApyColumn, getTableProps } = useMarketColumns();

  let placeholder: string | undefined;

  if (!isFetching) {
    placeholder = isReady ? t('lite.placeholders.noAssets') : t('lite.placeholders.unavailable');
  }

  const columns: TableColumn<LiteEarnAsset>[] = [
    {
      key: 'asset',
      label: t('lite.columns.asset'),
      selectOptionLabel: t('lite.columns.asset'),
      renderCell: earnAsset => (
        <button
          type="button"
          onClick={() => onSelect(earnAsset)}
          aria-label={t('lite.assetAriaLabel', { symbol: earnAsset.token.symbol })}
          className="cursor-pointer hover:text-brand focus-visible:outline-2 focus-visible:outline-brand max-md:min-h-11"
        >
          <TokenIconWithSymbol
            token={earnAsset.token}
            size="xl"
            symbolClassName="font-normal group-hover:font-semibold"
          />
        </button>
      ),
    },
    buildApyColumn<LiteEarnAsset>({
      renderCell: earnAsset => (
        <MarketApy source={getHighestApyMarket(earnAsset).source} showBadgeOnly />
      ),
      secondary: {
        label: t('lite.columns.totalSupply'),
        getCents: earnAsset => earnAsset.supplyCents,
      },
      sortRows: (rowA, rowB, direction) =>
        (BigNumber.maximum(...rowA.markets.map(market => market.apyPercentage)).comparedTo(
          BigNumber.maximum(...rowB.markets.map(market => market.apyPercentage)),
        ) ?? 0) * (direction === 'desc' ? -1 : 1),
    }),
    buildAmountColumn<LiteEarnAsset>({
      key: 'liquidity',
      label: t('lite.columns.liquidity'),
      getTokens: earnAsset => earnAsset.liquidityTokens,
      getCents: earnAsset => earnAsset.liquidityCents,
      getToken: earnAsset => earnAsset.token,
    }),
    buildAmountColumn<LiteEarnAsset>({
      key: 'supply',
      label: t('lite.columns.totalSupply'),
      getTokens: earnAsset => earnAsset.supplyTokens,
      getCents: earnAsset => earnAsset.supplyCents,
      getToken: earnAsset => earnAsset.token,
    }),
  ];

  return (
    <Table
      data={isReady ? earnAssets : []}
      {...getTableProps({ columns, columnWidths: ['25%', '25%', '25%', '25%'] })}
      rowKeyExtractor={earnAsset => earnAsset.key}
      rowOnClick={(_event, earnAsset) => onSelect(earnAsset)}
      initialOrder={{ orderBy: columns[1], orderDirection: 'desc' }}
      isFetching={isFetching}
      header={header}
      placeholder={placeholder}
    />
  );
};
