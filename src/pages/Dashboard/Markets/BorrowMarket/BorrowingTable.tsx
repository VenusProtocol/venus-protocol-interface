/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { ProgressBar, Table, Token, ITableProps, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IBorrowingUiProps extends Pick<ITableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
  userTotalBorrowLimitCents: BigNumber;
}

const BorrowingTable: React.FC<IBorrowingUiProps> = ({
  assets,
  isXvsEnabled,
  userTotalBorrowLimitCents,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();
  const localStyles = useLocalStyles();
  const styles = { ...sharedStyles, ...localStyles };

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'balance', label: t('markets.columns.balance'), orderable: true },
      { key: 'percentOfLimit', label: t('markets.columns.percentOfLimit'), orderable: true },
    ],
    [],
  );

  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;
    const percentOfLimit = calculatePercentage({
      numerator: +asset.borrowBalance.multipliedBy(asset.tokenPrice).times(100),
      denominator: +userTotalBorrowLimitCents,
    });
    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apy',
        render: () => <div>{formatToReadablePercentage(borrowApy)}</div>,
        value: borrowApy.toNumber(),
      },
      {
        key: 'balance',
        render: () => (
          <LayeredValues
            topValue={formatCentsToReadableValue({
              value: asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
            })}
            bottomValue={formatCoinsToReadableValue({
              value: asset.borrowBalance,
              tokenId: asset.id as TokenId,
              shorthand: true,
            })}
          />
        ),
        value: asset.borrowBalance.toFixed(),
      },
      {
        key: 'percentOfLimit',
        render: () => (
          <div css={styles.percentOfLimit}>
            <ProgressBar
              min={0}
              max={100}
              value={percentOfLimit}
              step={1}
              ariaLabel={t('markets.columns.percentOfLimit')}
              css={styles.percentOfLimitProgressBar}
            />

            <Typography variant="small2" css={styles.white}>
              {formatToReadablePercentage(percentOfLimit)}
            </Typography>
          </div>
        ),
        value: percentOfLimit.toFixed(),
      },
    ];
  });

  return (
    <Table
      title={t('markets.borrowingTableTitle')}
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
      css={[sharedStyles.marketTable, styles.cardContentGrid]}
    />
  );
};

export default BorrowingTable;
