/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { EllipseAddress, Table, type TableColumn, TokenIcon } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { Link } from 'containers/Link';
import { useHideXlDownCss, useShowXlDownCss } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { Transaction } from 'types';
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

  const eventTranslationKeys = useMemo(
    () => ({
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
    }),
    [t],
  );

  const columns: TableColumn<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: 'event',
        header: t('history.columns.type'),
        cell: ({ row }) =>
          row.original.token && (
            <>
              <div css={[styles.whiteText, styles.typeCol, hideXlDownCss]}>
                <TokenIcon token={row.original.token} css={styles.icon} />

                <Typography variant="small2" color="textPrimary">
                  {eventTranslationKeys[row.original.event]}
                </Typography>
              </div>

              <div css={[styles.cardTitle, showXlDownCss]}>
                <div css={styles.typeCol}>
                  <TokenIcon token={row.original.token} css={styles.icon} />

                  <Typography variant="small2" color="textPrimary">
                    {row.original.event}
                  </Typography>
                </div>
              </div>
            </>
          ),
      },
      {
        accessorKey: 'hash',
        header: t('history.columns.hash'),
        cell: ({ row }) => (
          <Link
            href={generateChainExplorerUrl({
              hash: row.original.transactionHash,
              urlType: 'tx',
              chainId,
            })}
            className="text-blue"
          >
            <EllipseAddress address={row.original.transactionHash} />
          </Link>
        ),
      },
      {
        accessorKey: 'blockNumber',
        header: t('history.columns.block'),
        cell: ({ row }) => (
          <Typography variant="small2" color="textPrimary">
            {row.original.blockNumber}
          </Typography>
        ),
      },
      {
        accessorKey: 'from',
        header: t('history.columns.from'),
        cell: ({ row }) => (
          <Link
            href={generateChainExplorerUrl({
              hash: row.original.from,
              urlType: 'address',
              chainId,
            })}
            className="text-blue"
          >
            <EllipseAddress address={row.original.from} />
          </Link>
        ),
      },
      {
        accessorKey: 'to',
        header: t('history.columns.to'),
        cell: ({ row }) =>
          row.original.to ? (
            <Link
              href={generateChainExplorerUrl({
                hash: row.original.to,
                urlType: 'address',
                chainId,
              })}
              className="text-blue"
            >
              <EllipseAddress address={row.original.to} />
            </Link>
          ) : (
            PLACEHOLDER_KEY
          ),
      },
      {
        accessorFn: row => row.amountMantissa.toNumber(),
        header: t('history.columns.amount'),
        cell: ({ row }) =>
          row.original.token && (
            <Typography variant="small2" css={styles.whiteText}>
              {convertMantissaToTokens({
                value: row.original.amountMantissa,
                token: row.original.token,
                returnInReadableFormat: true,

                addSymbol: false,
              })}
            </Typography>
          ),
      },
      {
        accessorKey: 'timestamp',
        header: t('history.columns.created'),
        cell: ({ row }) => (
          <Typography variant="small2" css={styles.whiteText}>
            {t('history.createdAt', {
              date: row.original.timestamp,
            })}
          </Typography>
        ),
      },
    ],
    [
      chainId,
      eventTranslationKeys,
      hideXlDownCss,
      showXlDownCss,
      t,
      styles.cardTitle,
      styles.icon,
      styles.typeCol,
      styles.whiteText,
    ],
  );

  return (
    <Table
      columns={columns}
      data={transactions}
      initialState={{
        sorting: [
          {
            id: 'block',
            desc: true,
          },
        ],
      }}
      isFetching={isFetching}
    />
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, isFetching }) => (
  <HistoryTableUi transactions={transactions} isFetching={isFetching} />
);

export default HistoryTable;
