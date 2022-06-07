/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Table, Token, TableProps, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { Market, TokenId } from 'types';
import { useGetMarkets } from 'clients/api';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IMarketTableProps extends Pick<TableProps, 'getRowHref'> {
  markets: Market[];
}

export const MarketTableUi: React.FC<IMarketTableProps> = ({ markets, getRowHref }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = { ...sharedStyles, ...localStyles };

  const columns = useMemo(
    () => [
      { key: 'market', label: t('market.columns.market'), orderable: false, align: 'left' },
      {
        key: 'totalSupply',
        label: t('market.columns.totalSupply'),
        orderable: true,
        align: 'right',
      },
      { key: 'supplyApy', label: t('market.columns.supplyApy'), orderable: true, align: 'right' },
      {
        key: 'totalBorrows',
        label: t('market.columns.totalBorrow'),
        orderable: true,
        align: 'right',
      },
      { key: 'borrowApy', label: t('market.columns.borrowApy'), orderable: true, align: 'right' },
      { key: 'liquidity', label: t('market.columns.liquidity'), orderable: true, align: 'right' },
      { key: 'price', label: t('market.columns.price'), orderable: true, align: 'right' },
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
          key: 'market',
          render: () => <Token tokenId={market.id as TokenId} css={styles.whiteText} />,
          value: market.id,
        },
        {
          key: 'totalSupply',
          render: () => (
            <LayeredValues
              topValue={formatCentsToReadableValue({
                value: market.treasuryTotalSupplyUsdCents,
                shortenLargeValue: true,
              })}
              bottomValue={formatCoinsToReadableValue({
                value: market.treasuryTotalSupplyUsdCents.div(market.tokenPrice.times(100)),
                tokenId: market.id as TokenId,
                minimizeDecimals: true,
                shortenLargeValue: true,
              })}
              css={styles.noWrap}
            />
          ),
          align: 'right',
          value: market.treasuryTotalSupplyUsdCents.toFixed(),
        },
        {
          key: 'supplyApy',
          render: () => (
            <LayeredValues
              topValue={formatToReadablePercentage(market.supplyApy.plus(market.supplyVenusApy))}
              bottomValue={formatToReadablePercentage(market.supplyVenusApy)}
            />
          ),
          value: market.supplyApy.plus(market.supplyVenusApy).toFixed(),
          align: 'right',
        },
        {
          key: 'totalBorrows',
          render: () => (
            <LayeredValues
              topValue={formatCentsToReadableValue({
                value: market.treasuryTotalBorrowsUsdCents,
                shortenLargeValue: true,
              })}
              bottomValue={formatCoinsToReadableValue({
                value: market.treasuryTotalBorrowsUsdCents.div(market.tokenPrice.times(100)),
                tokenId: market.id as TokenId,
                minimizeDecimals: true,
                shortenLargeValue: true,
              })}
              css={styles.noWrap}
            />
          ),
          value: market.treasuryTotalBorrowsUsdCents.toFixed(),
          align: 'right',
        },
        {
          key: 'borrowApy',
          render: () => (
            <LayeredValues
              topValue={formatToReadablePercentage(market.borrowApy.plus(market.borrowVenusApy))}
              bottomValue={formatToReadablePercentage(market.borrowVenusApy)}
            />
          ),
          value: market.borrowApy.plus(market.borrowVenusApy).toFixed(),
          align: 'right',
        },
        {
          key: 'liquidity',
          render: () => (
            <Typography variant="small1" css={styles.whiteText}>
              {formatCentsToReadableValue({
                value: market.liquidity.multipliedBy(100),
                shortenLargeValue: true,
              })}
            </Typography>
          ),
          value: market.liquidity.toFixed(),
          align: 'right',
        },
        {
          key: 'price',
          render: () => (
            <Typography variant="small1" css={styles.whiteText}>
              {formatCentsToReadableValue({ value: market.tokenPrice.multipliedBy(100) })}
            </Typography>
          ),
          align: 'right',
          value: market.tokenPrice.toFixed(),
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
        orderBy: 'totalSupply',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      getRowHref={getRowHref}
      tableCss={sharedStyles.table}
      cardsCss={sharedStyles.cards}
      css={sharedStyles.cardContentGrid}
    />
  );
};

const MarketTable = () => {
  const { data: { markets } = { markets: [], dailyVenusWei: undefined } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenusWei: undefined },
    refetchInterval: 10 * 1000, // Refetch the data every 10 seconds
  });
  return <MarketTableUi markets={markets} getRowHref={row => `/market/${row[0].value}`} />;
};

export default MarketTable;
