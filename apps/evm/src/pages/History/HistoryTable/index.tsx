/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { EllipseAddress, Table, TableColumn, TokenIcon } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { Link } from 'containers/Link';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { Transaction } from 'types';
import { convertMantissaToTokens, generateChainExplorerUrl } from 'utilities';

import { useStyles } from './styles';

export interface HistoryTableProps {
  transactions: Transaction[];
  isFetching: boolean;
}

export const HistoryTableUi: React.FC<HistoryTableProps> = ({ transactions, isFetching }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { chainId } = useChainId();

  const showXlDownCss = useShowXlDownCss();
  const hideXlDownCss = useHideXlDownCss();

  const eventTranslationKeys = {
    All: t('history.all'),
    Mint: t('history.mint'),
    Transfer: t('history.transfer'),
    Borrow: t('history.borrow'),
    RepayBorrow: t('history.repayBorrow'),
    Redeem: t('history.redeem'),
    Approval: t('history.approval'),
    LiquidateBorrow: t('history.liquidateBorrow'),
    ReservesAdded: t('history.reservesAdded'),
    ReservesReduced: t('history.reservesReduced'),
    MintVAI: t('history.mintVAI'),
    Withdraw: t('history.withdraw'),
    RepayVAI: t('history.repayVAI'),
    Deposit: t('history.deposit'),
    VoteCast: t('history.voteCast'),
    ProposalCreated: t('history.proposalCreated'),
    ProposalQueued: t('history.proposalQueued'),
    ProposalExecuted: t('history.proposalExecuted'),
    ProposalCanceled: t('history.proposalCanceled'),
  };

  const columns: TableColumn<Transaction>[] = useMemo(
    () => [
      {
        key: 'type',
        label: t('history.columns.type'),
        selectOptionLabel: t('history.columns.type'),
        renderCell: transaction =>
          transaction.token && (
            <>
              <div css={[styles.whiteText, styles.typeCol, hideXlDownCss]}>
                <TokenIcon token={transaction.token} css={styles.icon} />

                <Typography variant="small2" color="textPrimary">
                  {eventTranslationKeys[transaction.event]}
                </Typography>
              </div>

              <div css={[styles.cardTitle, showXlDownCss]}>
                <div css={styles.typeCol}>
                  <TokenIcon token={transaction.token} css={styles.icon} />

                  <Typography variant="small2" color="textPrimary">
                    {transaction.event}
                  </Typography>
                </div>
              </div>
            </>
          ),
      },
      {
        key: 'hash',
        label: t('history.columns.hash'),
        selectOptionLabel: t('history.columns.hash'),
        renderCell: transaction => (
          <Link
            href={generateChainExplorerUrl({
              hash: transaction.transactionHash,
              urlType: 'tx',
              chainId,
            })}
            className="text-blue"
          >
            <EllipseAddress address={transaction.transactionHash} />
          </Link>
        ),
      },
      {
        key: 'block',
        label: t('history.columns.block'),
        selectOptionLabel: t('history.columns.block'),
        renderCell: transaction => (
          <Typography variant="small2" color="textPrimary">
            {transaction.blockNumber}
          </Typography>
        ),
      },
      {
        key: 'from',
        label: t('history.columns.from'),
        selectOptionLabel: t('history.columns.from'),
        renderCell: transaction => (
          <Link
            href={generateChainExplorerUrl({
              hash: transaction.from,
              urlType: 'address',
              chainId,
            })}
            className="text-blue"
          >
            <EllipseAddress address={transaction.from} />
          </Link>
        ),
      },
      {
        key: 'to',
        label: t('history.columns.to'),
        selectOptionLabel: t('history.columns.to'),
        renderCell: transaction =>
          transaction.to ? (
            <Link
              href={generateChainExplorerUrl({
                hash: transaction.to,
                urlType: 'address',
                chainId,
              })}
              className="text-blue"
            >
              <EllipseAddress address={transaction.to} />
            </Link>
          ) : (
            PLACEHOLDER_KEY
          ),
      },
      {
        key: 'amount',
        label: t('history.columns.amount'),
        selectOptionLabel: t('history.columns.amount'),
        renderCell: transaction =>
          transaction.token && (
            <Typography variant="small2" css={styles.whiteText}>
              {convertMantissaToTokens({
                value: transaction.amountMantissa,
                token: transaction.token,
                returnInReadableFormat: true,

                addSymbol: false,
              })}
            </Typography>
          ),
      },
      {
        key: 'created',
        label: t('history.columns.created'),
        selectOptionLabel: t('history.columns.created'),
        renderCell: transaction => (
          <Typography variant="small2" css={styles.whiteText}>
            {t('history.createdAt', {
              date: transaction.timestamp,
            })}
          </Typography>
        ),
      },
    ],
    [chainId, eventTranslationKeys, hideXlDownCss, showXlDownCss, t],
  );

  const cardColumns = useMemo(() => {
    // Copy columns to order them for mobile
    const newColumns = [...columns];
    // Place account as the third position on the top row
    const [amountCol] = newColumns.splice(5, 1);
    newColumns.splice(3, 0, amountCol);
    return newColumns;
  }, [columns]);

  return (
    <Table
      columns={columns}
      cardColumns={cardColumns}
      data={transactions}
      initialOrder={{
        orderBy: columns[1],
        orderDirection: 'desc',
      }}
      rowKeyExtractor={row =>
        `history-table-row-${row.transactionHash}-${row.logIndex}-${row.amountMantissa}-${row.category}-${row.from}-${row.to}-${row.event}-${row.token.address}-${row.blockNumber}`
      }
      breakpoint="xl"
      css={styles.cardContentGrid}
      isFetching={isFetching}
    />
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, isFetching }) => (
  <HistoryTableUi transactions={transactions} isFetching={isFetching} />
);

export default HistoryTable;
