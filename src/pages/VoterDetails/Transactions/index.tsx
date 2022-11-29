/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { AnchorButton, Icon, Spinner, Table, TableColumn } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { VoteDetailTransaction } from 'types';
import { convertWeiToTokens, generateBscScanUrl } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

interface TransactionsProps {
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
  className?: string;
}

export const Transactions: React.FC<TransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const columns: TableColumn<VoteDetailTransaction>[] = useMemo(
    () => [
      {
        key: 'action',
        label: t('voterDetail.actions'),
        renderCell: transaction => {
          if (transaction.type === 'transfer') {
            return transaction.to.toLowerCase() === address.toLowerCase() ? (
              <Typography css={styles.action} variant="small2" color="textPrimary">
                <Icon name="arrowShaft" css={styles.received} />
                {t('voterDetail.receivedXvs')}
              </Typography>
            ) : (
              <Typography css={styles.action} variant="small2" color="textPrimary">
                <Icon name="arrowShaft" css={styles.sent} />
                {t('voterDetail.sentXvs')}
              </Typography>
            );
          }

          if (transaction.type === 'vote') {
            switch (transaction.support) {
              case 'AGAINST':
                return (
                  <>
                    <div css={[styles.icon, styles.against]}>
                      <Icon name="close" />
                    </div>
                    {t('voterDetail.votedAgainst')}
                  </>
                );
              case 'FOR':
                return (
                  <>
                    <div css={[styles.icon, styles.for]}>
                      <Icon name="mark" />
                    </div>
                    {t('voterDetail.votedFor')}
                  </>
                );
              case 'ABSTAIN':
                return (
                  <>
                    <div css={[styles.icon, styles.abstain]}>
                      <Icon name="dots" />
                    </div>
                    {t('voterDetail.votedAbstain')}
                  </>
                );
              default:
                return <></>;
            }
          }

          return <></>;
        },
      },
      {
        key: 'sent',
        label: t('voterDetail.sent'),
        renderCell: transaction =>
          t('voterDetail.readableSent', { date: transaction.blockTimestamp }),
      },
      {
        key: 'amount',
        label: t('voterDetail.amount'),
        align: 'right',
        renderCell: transaction => {
          let valueWei: BigNumber | undefined;

          if (transaction.type === 'transfer') {
            valueWei = transaction.amountWei;
          } else if (transaction.type === 'vote') {
            valueWei = transaction.votesWei;
          }

          return valueWei
            ? convertWeiToTokens({
                valueWei,
                token: TOKENS.xvs,
                minimizeDecimals: true,
                returnInReadableFormat: true,
              })
            : PLACEHOLDER_KEY;
        },
      },
    ],
    [],
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
          rowKeyExtractor={row => `voter-transaction-table-row-${row.transactionHash}`}
          breakpoint="sm"
          css={styles.cardContentGrid}
        />
      ) : (
        <Spinner css={styles.spinner} />
      )}
      <AnchorButton
        css={[styles.horizontalPadding, styles.anchorButton]}
        variant="secondary"
        href={generateBscScanUrl(address, 'address')}
      >
        {t('voterDetail.viewAll')}
      </AnchorButton>
    </Paper>
  );
};

export default Transactions;
