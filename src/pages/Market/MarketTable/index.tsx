/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import { Typography } from '@mui/material';
import { AuthContext } from 'context/AuthContext';
import { Table, Token, TableProps, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import { useGetUserMarketInfo } from 'clients/api';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IMarketTableProps extends Pick<TableProps, 'getRowHref'> {
  assets: Asset[];
}

export const MarketTableUi: React.FC<IMarketTableProps> = ({ assets, getRowHref }) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = { ...sharedStyles, ...localStyles };

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

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenId} />,
      value: asset.id,
      align: 'left',
    },
    {
      key: 'totalSupply',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: asset.treasuryTotalSupplyUsdCents,
            shortenLargeValue: true,
          })}
          bottomValue={formatCoinsToReadableValue({
            value: asset.treasuryTotalSupplyUsdCents.div(asset.tokenPrice.times(100)),
            tokenId: asset.id,
            minimizeDecimals: true,
          })}
          css={styles.noWrap}
        />
      ),
      value: asset.treasuryTotalSupplyUsdCents.toFixed(),
      align: 'right',
    },
    {
      key: 'supplyApy',
      render: () => (
        <LayeredValues
          topValue={formatToReadablePercentage(asset.supplyApy.plus(asset.xvsSupplyApy))}
          bottomValue={formatToReadablePercentage(asset.xvsSupplyApy)}
        />
      ),
      value: asset.supplyApy.plus(asset.xvsSupplyApy).toFixed(),
      align: 'right',
    },
    {
      key: 'totalBorrows',
      render: () => (
        <LayeredValues
          topValue={formatCentsToReadableValue({
            value: asset.treasuryTotalBorrowsUsdCents,
            shortenLargeValue: true,
          })}
          bottomValue={formatCoinsToReadableValue({
            value: asset.treasuryTotalBorrowsUsdCents.div(asset.tokenPrice.times(100)),
            tokenId: asset.id,
            minimizeDecimals: true,
          })}
          css={styles.noWrap}
        />
      ),
      value: asset.treasuryTotalBorrowsUsdCents.toFixed(),
      align: 'right',
    },
    {
      key: 'borrowApy',
      render: () => (
        <LayeredValues
          topValue={formatToReadablePercentage(asset.borrowApy.plus(asset.xvsBorrowApy))}
          bottomValue={formatToReadablePercentage(asset.xvsBorrowApy)}
        />
      ),
      value: asset.borrowApy.plus(asset.xvsBorrowApy).toFixed(),
      align: 'right',
    },
    {
      key: 'liquidity',
      render: () => (
        <Typography variant="small1" css={styles.whiteText}>
          {formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
            shortenLargeValue: true,
          })}
        </Typography>
      ),
      value: asset.liquidity.toFixed(),
      align: 'right',
    },
    {
      key: 'price',
      render: () => (
        <Typography variant="small1" css={styles.whiteText}>
          {formatCentsToReadableValue({ value: asset.tokenPrice.multipliedBy(100) })}
        </Typography>
      ),
      value: asset.tokenPrice.toFixed(),
      align: 'right',
    },
  ]);

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
      css={sharedStyles.cardContentGrid}
    />
  );
};

const MarketTable = () => {
  const { account } = useContext(AuthContext);
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address || '',
  });

  return <MarketTableUi assets={assets} getRowHref={row => `/market/${row[0].value}`} />;
};

export default MarketTable;
