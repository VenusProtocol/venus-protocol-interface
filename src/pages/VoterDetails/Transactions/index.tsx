/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { AnchorButton, Icon, Spinner, Table, TableProps } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { VoteDetailTransaction } from 'types';
import { convertWeiToTokens, generateBscScanUrl } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

interface TransactionsProps {
  className?: string;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
}

export const Transactions: React.FC<TransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      { key: 'action', label: t('voterDetail.actions'), orderable: false, align: 'left' },
      { key: 'sent', label: t('voterDetail.sent'), orderable: false, align: 'left' },
      { key: 'amount', label: t('voterDetail.amount'), orderable: false, align: 'right' },
    ],
    [],
  );

  const rows: TableProps['data'] = useMemo(
    () =>
      voterTransactions.map(voterTxs => {
        // Transfer
        let action = <></>;
        let amountWei = new BigNumber(0);
        if (voterTxs.type === 'transfer') {
          action =
            voterTxs.to.toLowerCase() === address.toLowerCase() ? (
              <>
                <Icon name="arrowShaft" css={styles.received} />
                {t('voterDetail.receivedXvs')}
              </>
            ) : (
              <>
                <Icon name="arrowShaft" css={styles.sent} />
                {t('voterDetail.sentXvs')}
              </>
            );
          ({ amountWei } = voterTxs);
        }
        // Vote
        if (voterTxs.type === 'vote') {
          switch (voterTxs.support) {
            case 'AGAINST':
              action = (
                <>
                  <div css={[styles.icon, styles.against]}>
                    <Icon name="close" />
                  </div>
                  {t('voterDetail.votedAgainst')}
                </>
              );
              break;
            case 'FOR':
              action = (
                <>
                  <div css={[styles.icon, styles.for]}>
                    <Icon name="mark" />
                  </div>
                  {t('voterDetail.votedFor')}
                </>
              );
              break;
            case 'ABSTAIN':
              action = (
                <>
                  <div css={[styles.icon, styles.abstain]}>
                    <Icon name="dots" />
                  </div>
                  {t('voterDetail.votedAbstain')}
                </>
              );
            // no default
          }
          amountWei = voterTxs.votesWei;
        }

        return [
          {
            key: 'action',
            render: () => (
              <Typography css={styles.action} variant="small2" color="textPrimary">
                {action}
              </Typography>
            ),
            value: voterTxs.type === 'vote' ? voterTxs.support : voterTxs.to,
            align: 'left',
          },
          {
            key: 'sent',
            render: () => t('voterDetail.readableSent', { date: voterTxs.blockTimestamp }),
            value: voterTxs.createdAt.getTime(),
            align: 'left',
          },
          {
            key: 'amount',
            render: () =>
              convertWeiToTokens({
                valueWei: amountWei,
                token: TOKENS.xvs,
                minimizeDecimals: true,
                returnInReadableFormat: true,
              }),
            value: amountWei.toFixed(),
            align: 'right',
          },
        ];
      }),
    [JSON.stringify(voterTransactions)],
  );

  return (
    <Paper css={styles.root} className={className}>
      <Typography css={styles.horizontalPadding} variant="h4">
        {t('voterDetail.transactions')}
      </Typography>

      {voterTransactions && voterTransactions.length ? (
        <Table
          columns={columns}
          data={rows}
          rowKeyExtractor={row =>
            row.reduce((acc, cell) => `${acc}-${cell.value}`, 'voter-transaction')
          }
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
