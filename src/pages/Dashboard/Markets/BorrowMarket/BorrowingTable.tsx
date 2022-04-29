/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { ProgressBar, Table, Token } from 'components';
import { ITableProps } from 'components/v2/Table/useTable';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useIsSmDown } from 'hooks/responsive';
import { useStyles } from '../styles';

export interface IBorrowingUiProps extends Pick<ITableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
  userTotalBorrowLimit: BigNumber;
}

const BorrowingTable: React.FC<IBorrowingUiProps> = ({
  assets,
  isXvsEnabled,
  userTotalBorrowLimit,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const styles = useStyles();
  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apyEarned', label: t('markets.columns.apyEarned'), orderable: true },
      { key: 'balance', label: t('markets.columns.balance'), orderable: true },
      { key: 'percentOfLimit', label: t('markets.columns.percentOfLimit'), orderable: true },
    ],
    [],
  );

  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;
    const percentOfLimit = asset.borrowBalance.div(userTotalBorrowLimit).times(100);
    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apyEarned',
        render: () => <div>{formatToReadablePercentage(borrowApy)}</div>,
        value: borrowApy.toNumber(),
      },
      {
        key: 'balance',
        render: () => (
          <span css={styles.balance}>
            <Typography variant="small1">
              {formatCentsToReadableValue({
                value: asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
              })}
            </Typography>
            <Typography variant="small2">
              {formatCoinsToReadableValue({
                value: asset.borrowBalance,
                tokenId: asset.id as TokenId,
                shorthand: true,
              })}
            </Typography>
          </span>
        ),
        value: asset.borrowBalance.toString(),
      },
      {
        key: 'percentOfLimit',
        render: () => (
          <span css={styles.percentOfLimit}>
            <ProgressBar
              min={0}
              max={100}
              value={+percentOfLimit}
              step={1}
              ariaLabel={t('markets.columns.percentOfLimit')}
            />
            <Typography variant="small2" css={styles.white}>
              {formatToReadablePercentage(percentOfLimit.toFixed(2))}
            </Typography>
          </span>
        ),
        value: asset.liquidity.toNumber(),
      },
    ];
  });

  return (
    <Table
      title={t('markets.borrowingTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apyEarned',
        orderDirection: 'asc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      gridTemplateColumns={isSmDown ? '1fr 1fr 1fr' : '120px 1fr 1fr 1fr'}
      isMobileView={isSmDown}
    />
  );
};

export default BorrowingTable;
