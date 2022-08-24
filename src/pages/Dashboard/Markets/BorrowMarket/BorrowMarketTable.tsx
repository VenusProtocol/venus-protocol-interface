/** @jsxImportSource @emotion/react */
import { Table, TableProps, Token } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import { useHideLgDownCss, useShowLgDownCss } from 'hooks/responsive';

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

  const showLgDownCss = useShowLgDownCss();
  const hideLgDownCss = useHideLgDownCss();

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
        render: () => <Token tokenId={asset.id} />,
        value: asset.id,
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
            tokenId: asset.id,
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
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      tableCss={hideLgDownCss}
      cardsCss={showLgDownCss}
      css={[sharedStyles.marketTable, styles.cardContentGrid]}
    />
  );
};

export default BorrowMarketTable;
