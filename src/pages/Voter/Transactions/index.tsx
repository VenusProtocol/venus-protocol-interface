/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import { ButtonWrapper, Icon, Link, Spinner, Table, TableColumn } from 'components';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { VoteDetail, VoteSupport } from 'types';
import { convertWeiToTokens, generateChainExplorerUrl } from 'utilities';

import { useAuth } from 'context/AuthContext';

import { useStyles } from './styles';

interface TransactionsProps {
  address: string;
  voterTransactions: VoteDetail[] | undefined;
  className?: string;
}

export const Transactions: React.FC<TransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { chainId } = useAuth();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const columns: TableColumn<VoteDetail>[] = useMemo(
    () => [
      {
        key: 'action',
        label: t('voterDetail.actions'),
        selectOptionLabel: t('voterDetail.actions'),
        renderCell: transaction => {
          switch (transaction.support) {
            case VoteSupport.Against:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.against]}>
                    <Icon name="closeRounded" />
                  </div>
                  {t('voterDetail.votedAgainst')}
                </div>
              );
            case VoteSupport.For:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.for]}>
                    <Icon name="mark" className="text-offWhite" />
                  </div>
                  {t('voterDetail.votedFor')}
                </div>
              );
            case VoteSupport.Abstain:
              return (
                <div css={styles.row}>
                  <div css={[styles.icon, styles.abstain]}>
                    <Icon name="dots" />
                  </div>
                  {t('voterDetail.votedAbstain')}
                </div>
              );
            default:
              return <></>;
          }
        },
      },
      {
        key: 'sent',
        label: t('voterDetail.sent'),
        selectOptionLabel: t('voterDetail.sent'),
        renderCell: transaction =>
          t('voterDetail.readableSent', { date: transaction.blockTimestamp }),
      },
      {
        key: 'amount',
        label: t('voterDetail.amount'),
        selectOptionLabel: t('voterDetail.amount'),
        align: 'right',
        renderCell: transaction =>
          convertWeiToTokens({
            valueWei: transaction.votesMantissa,
            token: xvs,
            returnInReadableFormat: true,
          }),
      },
    ],
    [t, xvs],
  );

  return (
    <Paper css={styles.root} className={className}>
      <Typography css={styles.horizontalPadding} variant="h4">
        {t('voterDetail.transactions')}
      </Typography>

      {voterTransactions && voterTransactions.length ? (
        <Table
          columns={columns}
          data={voterTransactions}
          rowKeyExtractor={row => `voter-transaction-table-row-${row.blockNumber}`}
          breakpoint="sm"
          css={styles.cardContentGrid}
        />
      ) : (
        <Spinner css={styles.spinner} />
      )}

      <ButtonWrapper
        variant="secondary"
        className="mt-4 text-offWhite hover:no-underline sm:mx-6 sm:mt-0"
        asChild
      >
        <Link
          href={generateChainExplorerUrl({
            hash: address,
            urlType: 'address',
            chainId,
          })}
        >
          {t('voterDetail.viewAll')}
        </Link>
      </ButtonWrapper>
    </Paper>
  );
};

export default Transactions;
