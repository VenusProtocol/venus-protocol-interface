/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { EllipseText, Icon, Table, TableProps } from 'components';
import { generateBscScanUrl, getTokenIdFromVAddress } from 'utilities';
import { formatCoinsToReadableValue } from 'utilities/common';
import { useTranslation } from 'translation';
import { TokenId, Transaction } from 'types';
import { useStyles } from './styles';

export interface IHistoryTableProps {
  transactions: Transaction[];
}

export const HistoryTableUi: React.FC<IHistoryTableProps> = ({ transactions }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'id', label: t('history.columns.id'), orderable: true, align: 'left' },
      { key: 'type', label: t('history.columns.type'), orderable: true, align: 'left' },
      { key: 'txnHash', label: t('history.columns.txnHash'), orderable: true, align: 'left' },
      { key: 'block', label: t('history.columns.block'), orderable: true, align: 'left' },
      { key: 'from', label: t('history.columns.from'), orderable: true, align: 'left' },
      { key: 'to', label: t('history.columns.to'), orderable: true, align: 'left' },
      { key: 'amount', label: t('history.columns.amount'), orderable: true, align: 'right' },
      { key: 'createdAt', label: t('history.columns.createdAt'), orderable: true, align: 'right' },
    ],
    [],
  );

  const cardColumns = useMemo(() => {
    // Copy columns to order them for mobile
    const newColumns = [...columns];
    // Remove id column, mobile title is handled by type component
    newColumns.shift();
    // Place account as the third position on the top row
    const [amountCol] = newColumns.splice(5, 1);
    newColumns.splice(3, 0, amountCol);
    return newColumns;
  }, [columns]);

  // Format assets to rows
  const rows: TableProps['data'] = transactions.map(txn => [
    {
      key: 'id',
      render: () => <Typography variant="small2">{txn.id}</Typography>,
      value: txn.id,
      align: 'left',
    },
    {
      key: 'type',
      render: () => (
        <>
          <div css={[styles.whiteText, styles.table, styles.typeCol]}>
            <Icon name={getTokenIdFromVAddress(txn.vTokenAddress) as TokenId} css={styles.icon} />
            <Typography variant="small2" color="textPrimary">
              {txn.event}
            </Typography>
          </div>
          <div css={[styles.cards, styles.cardTitle]}>
            <div css={styles.typeCol}>
              <Icon name={getTokenIdFromVAddress(txn.vTokenAddress) as TokenId} css={styles.icon} />
              <Typography variant="small2" color="textPrimary">
                {txn.event}
              </Typography>
            </div>
            <Typography variant="small2">{txn.id}</Typography>
          </div>
        </>
      ),
      value: txn.vTokenAddress,
      align: 'left',
    },
    {
      key: 'txnHash',
      render: () => (
        <EllipseText css={styles.txnHash} text={txn.transactionHash}>
          <Typography
            className="ellipse-text"
            component="a"
            href={generateBscScanUrl(txn.transactionHash, 'tx')}
            target="_blank"
            rel="noreferrer"
            variant="small2"
            css={styles.txnHashText}
          />
        </EllipseText>
      ),
      value: txn.transactionHash,
      align: 'left',
    },
    {
      key: 'block',
      render: () => (
        <Typography variant="small2" color="textPrimary">
          {txn.blockNumber}
        </Typography>
      ),
      value: txn.blockNumber,
      align: 'left',
    },
    {
      key: 'from',
      render: () => (
        <EllipseText css={styles.txnHash} text={txn.from}>
          <Typography
            className="ellipse-text"
            component="a"
            href={generateBscScanUrl(txn.from, 'address')}
            target="_blank"
            rel="noreferrer"
            variant="small2"
            css={styles.txnHashText}
          />
        </EllipseText>
      ),
      value: txn.from,
      align: 'left',
    },
    {
      key: 'to',
      render: () => (
        <EllipseText css={styles.txnHash} text={txn.to}>
          <Typography
            className="ellipse-text"
            component="a"
            href={generateBscScanUrl(txn.to, 'address')}
            target="_blank"
            rel="noreferrer"
            variant="small2"
            css={styles.txnHashText}
          />
        </EllipseText>
      ),
      value: txn.to,
      align: 'left',
    },
    {
      key: 'amount',
      render: () => (
        <Typography variant="small2" css={styles.whiteText}>
          {formatCoinsToReadableValue({
            value: txn.amount,
            tokenId: getTokenIdFromVAddress(txn.vTokenAddress) as TokenId,
            shorthand: true,
            symbol: false,
          })}
        </Typography>
      ),
      value: txn.amount.toFixed(),
      align: 'right',
    },
    {
      key: 'createdAt',
      render: () => (
        <Typography variant="small2" css={styles.whiteText}>
          {t('history.createdAt', { date: txn.createdAt })}
        </Typography>
      ),
      value: txn.createdAt.getTime(),
      align: 'right',
    },
  ]);

  return (
    <Table
      columns={columns}
      cardColumns={cardColumns}
      data={rows}
      initialOrder={{
        orderBy: 'createdAt',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
    />
  );
};

const HistoryTable = () => <HistoryTableUi transactions={[]} />;

export default HistoryTable;
