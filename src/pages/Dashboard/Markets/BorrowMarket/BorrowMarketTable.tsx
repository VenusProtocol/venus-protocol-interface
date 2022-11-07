/** @jsxImportSource @emotion/react */
import { Table, TableProps, TokenIconWithSymbol } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';

export interface BorrowMarketTableProps extends Pick<TableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
}

const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  assets,
  isXvsEnabled,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false, align: 'left' },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true, align: 'right' },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true, align: 'right' },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: true, align: 'right' },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <TokenIconWithSymbol token={asset.token} />,
        value: asset.token.id,
        align: 'left',
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(borrowApy),
        value: borrowApy.toNumber(),
        align: 'right',
      },
      {
        key: 'wallet',
        render: () =>
          formatTokensToReadableValue({
            value: asset.walletBalance,
            token: asset.token,
            minimizeDecimals: true,
          }),
        value: asset.walletBalance.toFixed(),
        align: 'right',
      },
      {
        key: 'liquidity',
        render: () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
            shortenLargeValue: true,
          }),
        value: asset.liquidity.toNumber(),
        align: 'right',
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
