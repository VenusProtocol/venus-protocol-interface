/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { ProgressBar, Table, Token, TableProps, LayeredValues } from 'components';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  formatTokensToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  calculatePercentage,
} from 'utilities';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles as useLocalStyles } from './styles';

export interface IBorrowingUiProps extends Pick<TableProps, 'rowOnClick'> {
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
      { key: 'asset', label: t('markets.columns.asset'), orderable: false, align: 'left' },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true, align: 'right' },
      { key: 'balance', label: t('markets.columns.balance'), orderable: true, align: 'right' },
      {
        key: 'percentOfLimit',
        label: t('markets.columns.percentOfLimit'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;
    const percentOfLimit = calculatePercentage({
      numerator: +asset.borrowBalance.multipliedBy(asset.tokenPrice).times(100),
      denominator: +userTotalBorrowLimitCents,
    });
    return [
      {
        key: 'asset',
        render: () => <Token tokenId={asset.id} />,
        value: asset.id,
        align: 'left',
      },
      {
        key: 'apy',
        render: () => <div>{formatToReadablePercentage(borrowApy)}</div>,
        value: borrowApy.toNumber(),
        align: 'right',
      },
      {
        key: 'balance',
        render: () => (
          <LayeredValues
            topValue={formatCentsToReadableValue({
              value: asset.borrowBalance.multipliedBy(asset.tokenPrice).multipliedBy(100),
            })}
            bottomValue={formatTokensToReadableValue({
              value: asset.borrowBalance,
              tokenId: asset.id,
              minimizeDecimals: true,
            })}
          />
        ),
        value: asset.borrowBalance.toFixed(),
        align: 'right',
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
        align: 'right',
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
