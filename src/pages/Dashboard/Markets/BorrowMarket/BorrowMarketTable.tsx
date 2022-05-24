/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Table, Token, TableProps } from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useStyles } from './styles';
import { useStyles as useSharedStyles } from '../styles';

export interface IBorrowMarketTableProps extends Pick<TableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
}

const BorrowMarketTable: React.FC<IBorrowMarketTableProps> = ({
  assets,
  isXvsEnabled,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: true },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(borrowApy),
        value: borrowApy.toNumber(),
      },
      {
        key: 'wallet',
        render: () =>
          formatCoinsToReadableValue({
            value: asset.walletBalance,
            tokenId: asset.id as TokenId,
            shorthand: true,
          }),
        value: asset.walletBalance.toFixed(),
      },
      {
        key: 'liquidity',
        render: () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
            shorthand: true,
          }),
        value: asset.liquidity.toNumber(),
      },
    ];
  });

  return (
    <Table
      title={t('markets.borrowMarketTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      tableCss={sharedStyles.table}
      cardsCss={sharedStyles.cards}
      css={[sharedStyles.marketTable, sharedStyles.generalMarketTable, styles.cardContentGrid]}
    />
  );
};

export default BorrowMarketTable;
