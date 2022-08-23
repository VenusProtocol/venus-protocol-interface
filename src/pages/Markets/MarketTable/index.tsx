/** @jsxImportSource @emotion/react */
import { RiskLevel, Table, TableProps, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Market, TokenId } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { useGetMarkets } from 'clients/api';

import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface MarketTableProps extends Pick<TableProps, 'getRowHref'> {
  markets: Market[];
}

export const MarketTableUi: React.FC<MarketTableProps> = ({ markets, getRowHref }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();

  const columns = useMemo(
    () => [
      { key: 'assets', label: t('market.columns.assets'), orderable: false },
      { key: 'market', label: t('market.columns.market'), orderable: true, align: 'right' },
      { key: 'riskLevel', label: t('market.columns.riskLevel'), orderable: true, align: 'right' },
      {
        key: 'totalSupply',
        label: t('market.columns.totalSupply'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'totalBorrow',
        label: t('market.columns.totalBorrow'),
        orderable: true,
        align: 'right',
      },
      { key: 'liquidity', label: t('market.columns.liquidity'), orderable: true, align: 'right' },
    ],
    [],
  );

  const cardColumns = useMemo(() => {
    const newColumns = [...columns];
    const [liquidityCol] = newColumns.splice(5, 1);
    newColumns.splice(3, 0, liquidityCol);
    return newColumns;
  }, [columns]);

  // Format markets to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      markets.map(market => [
        {
          key: 'asset',
          render: () => (
            // TODO: wire up
            <TokenGroup tokenIds={['usdt', 'eth', 'usdc', 'xrp', 'bnb', 'aave']} limit={4} />
          ),
          value: market.id,
        },
        {
          key: 'market',
          render: () => 'Venus', // TODO: wire up
          value: market.id,
          align: 'right',
        },
        {
          key: 'riskLevel',
          render: () => <RiskLevel variant="MINIMAL" />, // TODO: wire up
          value: market.id,
          align: 'right',
        },
        {
          key: 'totalSupply',
          render: () =>
            formatCentsToReadableValue({
              value: market.treasuryTotalSupplyCents,
              shortenLargeValue: true,
            }),
          align: 'right',
          value: market.treasuryTotalSupplyCents.toFixed(),
        },
        {
          key: 'totalBorrow',
          render: () =>
            formatCentsToReadableValue({
              value: market.treasuryTotalBorrowsCents,
              shortenLargeValue: true,
            }),
          value: market.treasuryTotalBorrowsCents.toFixed(),
          align: 'right',
        },
        {
          key: 'liquidity',
          render: () =>
            formatCentsToReadableValue({
              value: market.liquidity.multipliedBy(100),
              shortenLargeValue: true,
            }),
          value: market.liquidity.toFixed(),
          align: 'right',
        },
      ]),
    [JSON.stringify(markets)],
  );

  return (
    <Table
      columns={columns}
      cardColumns={cardColumns}
      data={rows}
      initialOrder={{
        orderBy: 'asset',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      getRowHref={getRowHref}
      tableCss={sharedStyles.table}
      cardsCss={sharedStyles.cards}
      css={localStyles.cardContentGrid}
    />
  );
};

const MarketTable = () => {
  // TODO: fetch isolated lending markets

  const { data: { markets } = { markets: [], dailyVenusWei: undefined } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenusWei: undefined },
  });

  return <MarketTableUi markets={markets} getRowHref={row => `/market/${row[0].value}`} />;
};

export default MarketTable;
