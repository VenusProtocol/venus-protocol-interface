/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { EllipseText, Icon, Table, TableProps } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { generateBscScanUrl, getTokenIdFromVAddress, convertWeiToTokens } from 'utilities';
import { useTranslation } from 'translation';
import { ITransaction } from 'types';
import { useStyles } from './styles';

export interface IHistoryTableProps {
  transactions: ITransaction[];
  isFetching: boolean;
}

export const HistoryTableUi: React.FC<IHistoryTableProps> = ({ transactions, isFetching }) => {
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
      { key: 'created', label: t('history.columns.created'), orderable: true, align: 'right' },
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

  // Format transactions to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      transactions.map(txn => {
        const tokenId =
          (txn.vTokenAddress && getTokenIdFromVAddress(txn.vTokenAddress)) || XVS_TOKEN_ID;

        return [
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
                  <Icon name={tokenId} css={styles.icon} />
                  <Typography variant="small2" color="textPrimary">
                    {txn.event}
                  </Typography>
                </div>
                <div css={[styles.cards, styles.cardTitle]}>
                  <div css={styles.typeCol}>
                    <Icon name={tokenId} css={styles.icon} />
                    <Typography variant="small2" color="textPrimary">
                      {txn.event}
                    </Typography>
                  </div>
                  <Typography variant="small2">{txn.id}</Typography>
                </div>
              </>
            ),
            value: txn.event,
            align: 'left',
          },
          {
            key: 'txnHash',
            render: () => (
              <EllipseText text={txn.transactionHash} minChars={6}>
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
              <EllipseText text={txn.from} minChars={6}>
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
            render: () =>
              txn.to ? (
                <EllipseText text={txn.to} minChars={6}>
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
              ) : (
                PLACEHOLDER_KEY
              ),
            value: txn.to,
            align: 'left',
          },
          {
            key: 'amount',
            render: () => (
              <Typography variant="small2" css={styles.whiteText}>
                {convertWeiToTokens({
                  valueWei: txn.amountWei,
                  tokenId,
                  returnInReadableFormat: true,
                  minimizeDecimals: true,
                  addSymbol: false,
                })}
              </Typography>
            ),
            value: txn.amountWei.toFixed(),
            align: 'right',
          },
          {
            key: 'created',
            render: () => (
              <Typography variant="small2" css={styles.whiteText}>
                {t('history.createdAt', { date: txn.createdAt })}
              </Typography>
            ),
            value: txn.createdAt.getTime(),
            align: 'right',
          },
        ];
      }),
    [JSON.stringify(transactions)],
  );

  return (
    <Table
      columns={columns}
      cardColumns={cardColumns}
      data={rows}
      initialOrder={{
        orderBy: 'created',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
      isFetching={isFetching}
    />
  );
};

const HistoryTable: React.FC<IHistoryTableProps> = ({ transactions, isFetching }) => (
  <HistoryTableUi transactions={transactions} isFetching={isFetching} />
);

export default HistoryTable;
