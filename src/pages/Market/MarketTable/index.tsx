/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Table, Token, TableProps, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { Market, TokenId } from 'types';
import { useGetMarkets } from 'clients/api';
import {
  formatTokensToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  convertPercentageFromSmartContract,
} from 'utilities';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IMarketTableProps extends Pick<TableProps, 'getRowHref'> {
  markets: Market[];
}

export const MarketTableUi: React.FC<IMarketTableProps> = ({ markets, getRowHref }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('market.columns.asset'), orderable: false, align: 'left' },
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
      {
        key: 'collateralFactor',
        label: t('market.columns.collateralFactor'),
        orderable: true,
        align: 'right',
      },
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
          key: 'asset',
          render: () => <Token tokenId={market.id as TokenId} css={localStyles.whiteText} />,
          value: market.id,
        },
        {
          key: 'totalSupply',
          render: () => (
            <LayeredValues
              topValue={formatCentsToReadableValue({
                value: market.treasuryTotalSupplyCents,
                shortenLargeValue: true,
              })}
              bottomValue={formatTokensToReadableValue({
                value: market.treasuryTotalSupplyCents.div(market.tokenPrice.times(100)),
                tokenId: market.id as TokenId,
                minimizeDecimals: true,
                shortenLargeValue: true,
              })}
              css={localStyles.noWrap}
            />
          ),
          align: 'right',
          value: market.treasuryTotalSupplyCents.toFixed(),
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
                value: market.treasuryTotalBorrowsCents,
                shortenLargeValue: true,
              })}
              bottomValue={formatTokensToReadableValue({
                value: market.treasuryTotalBorrowsCents.div(market.tokenPrice.times(100)),
                tokenId: market.id as TokenId,
                minimizeDecimals: true,
                shortenLargeValue: true,
              })}
              css={localStyles.noWrap}
            />
          ),
          value: market.treasuryTotalBorrowsCents.toFixed(),
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
            <Typography variant="small1" css={localStyles.whiteText}>
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
          key: 'collateralFactor',
          render: () => (
            <Typography variant="small1" css={localStyles.whiteText}>
              {formatToReadablePercentage(
                convertPercentageFromSmartContract(market.collateralFactor),
              )}
            </Typography>
          ),
          value: market.collateralFactor,
          align: 'right',
        },
        {
          key: 'price',
          render: () => (
            <Typography variant="small1" css={localStyles.whiteText}>
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
  const { data: { markets } = { markets: [], dailyVenusWei: undefined } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenusWei: undefined },
    refetchInterval: 10 * 1000, // Refetch the data every 10 seconds
  });
  return <MarketTableUi markets={markets} getRowHref={row => `/market/${row[0].value}`} />;
};

export default MarketTable;
