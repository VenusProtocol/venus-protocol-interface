/** @jsxImportSource @emotion/react */
import { RiskLevel, Select, Table, TableProps, TokenGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Market } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { useGetMarkets } from 'clients/api';
import Path from 'constants/path';
import { useShowXxlDownCss } from 'hooks/responsive';

import { useStyles } from './styles';

export interface MarketTableProps {
  markets: Market[];
}

export const MarketTableUi: React.FC<MarketTableProps> = ({ markets }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const showXxlDownCss = useShowXxlDownCss();

  // TODO: add all options
  const mobileSelectOptions = [
    {
      value: 'riskLevel',
      label: 'Risk level',
    },
  ];

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

  // Format markets to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      markets.map(market => [
        {
          key: 'assets',
          render: () => (
            // TODO: wire up
            <TokenGroup tokenIds={['usdt', 'eth', 'usdc', 'xrp', 'bnb', 'aave']} limit={4} />
          ),
          value: market.id, // TODO: wire up
        },
        {
          key: 'market',
          render: () => 'Venus', // TODO: wire up
          value: 'Venus', // TODO: wire up
          align: 'right',
        },
        {
          key: 'riskLevel',
          render: () => <RiskLevel variant="MINIMAL" />, // TODO: wire up
          value: 'MINIMAL', // TODO: wire up
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
    <>
      <Select
        css={[styles.mobileSelect, showXxlDownCss]}
        label={t('markets.mobileSelect.label')}
        title={t('markets.mobileSelect.title')}
        // TODO: wire up
        value={mobileSelectOptions[0].value}
        onChange={console.log}
        options={mobileSelectOptions}
        ariaLabel={t('markets.mobileSelect.ariaLabelFor')}
      />

      <Table
        columns={columns}
        data={rows}
        initialOrder={{
          orderBy: 'asset',
          orderDirection: 'desc',
        }}
        rowKeyExtractor={row => `${row[0].value}`}
        getRowHref={() => Path.MARKET.replace(':marketId', 'FAKE_MARKET_ID')} // TODO: wire up
        breakpoint="xxl"
        css={styles.cardContentGrid}
      />
    </>
  );
};

const MarketTable = () => {
  // TODO: fetch isolated lending markets

  const { data: { markets } = { markets: [], dailyVenusWei: undefined } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenusWei: undefined },
  });

  return <MarketTableUi markets={markets} />;
};

export default MarketTable;
