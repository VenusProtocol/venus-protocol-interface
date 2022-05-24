/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Table, Token, ITableProps, LayeredValues } from 'components';
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

export interface IMarketTableProps extends Pick<ITableProps, 'rowOnClick'> {
  markets: Market[];
}

export const MarketTableUi: React.FC<IMarketTableProps> = ({ markets, rowOnClick }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = { ...sharedStyles, ...localStyles };

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('market.columns.asset'), orderable: false },
      { key: 'totalSupply', label: t('market.columns.totalSupply'), orderable: true },
      { key: 'supplyApy', label: t('market.columns.supplyApy'), orderable: true },
      { key: 'totalBorrows', label: t('market.columns.totalBorrow'), orderable: true },
      { key: 'borrowApy', label: t('market.columns.borrowApy'), orderable: true },
      { key: 'liquidity', label: t('market.columns.liquidity'), orderable: true },
      { key: 'price', label: t('market.columns.price'), orderable: true },
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
  const rows: ITableProps['data'] = markets.map(market => [
    {
      key: 'asset',
      render: () => <Token symbol={market.underlyingSymbol as TokenId} />,
      value: market.id,
    },
    {
      key: 'totalSupply',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: market.treasuryTotalSupplyUsdCents,
            shorthand: true,
          })}
          bottomValue={formatCoinsToReadableValue({
            value: market.treasuryTotalSupplyUsdCents.div(market.tokenPrice.times(100)),
            tokenId: market.id as TokenId,
            shorthand: true,
          })}
        />
      ),
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
    },
    {
      key: 'totalBorrows',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: market.treasuryTotalBorrowsUsdCents,
            shorthand: true,
          })}
          bottomValue={formatCoinsToReadableValue({
            value: market.treasuryTotalBorrowsUsdCents.div(market.tokenPrice.times(100)),
            tokenId: market.id as TokenId,
            shorthand: true,
          })}
        />
      ),
      value: market.treasuryTotalBorrowsUsdCents.toFixed(),
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
    },
    {
      key: 'liquidity',
      render: () => (
        <Typography variant="small1" css={styles.whiteText}>
          {formatCentsToReadableValue({
            value: market.liquidity.multipliedBy(100),
            shorthand: true,
          })}
        </Typography>
      ),
      value: market.liquidity.toFixed(),
    },
    {
      key: 'price',
      render: () => (
        <Typography variant="small1" css={styles.whiteText}>
          {formatCentsToReadableValue({ value: market.tokenPrice.multipliedBy(100) })}
        </Typography>
      ),
      value: market.tokenPrice.toFixed(),
    },
  ]);

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
      rowOnClick={rowOnClick}
      tableCss={sharedStyles.table}
      cardsCss={sharedStyles.cards}
      css={sharedStyles.cardContentGrid}
    />
  );
};

const MarketTable = () => {
  const { data: { markets } = { markets: [], dailyVenus: undefined } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenus: undefined },
    refetchInterval: 10 * 1000, // Refetch the data 10 seconds
  });
  return <MarketTableUi markets={markets} />;
};

export default MarketTable;
