import React, { useMemo } from 'react';
import { Table, Token, ITableProps } from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useIsSmDown, useIsLgDown } from 'hooks/responsive';
import { useStyles } from './styles';

export interface IBorrowMarketTableProps extends Pick<ITableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
  hasBorrowingAssets: boolean;
}

const BorrowMarketTable: React.FC<IBorrowMarketTableProps> = ({
  assets,
  isXvsEnabled,
  rowOnClick,
  hasBorrowingAssets,
}) => {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const isLgDown = useIsLgDown();
  const styles = useStyles();

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
  const rows: ITableProps['data'] = assets.map(asset => {
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
      title={
        !hasBorrowingAssets && !isSmDown && isLgDown
          ? undefined
          : t('markets.borrowMarketTableTitle')
      }
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      gridTemplateColumns={styles.getGridTemplateColumns({ isCardLayout: isSmDown })}
    />
  );
};

export default BorrowMarketTable;
