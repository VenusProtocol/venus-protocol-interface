/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { uid } from 'react-uid';
import { Paper, Typography } from '@mui/material';
import { Icon, AnchorButton, Table, TableProps, Spinner } from 'components';
import { useTranslation } from 'translation';
import { generateBscScanUrl, convertWeiToTokens } from 'utilities';
import { VoteDetailTransaction } from 'types';
import { useStyles } from './styles';

interface ITransactionsProps {
  className?: string;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
}

export const Transactions: React.FC<ITransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      { key: 'action', label: t('voterDetail.actions'), orderable: false, align: 'left' },
      { key: 'age', label: t('voterDetail.age'), orderable: false, align: 'left' },
      { key: 'amount', label: t('voterDetail.amount'), orderable: false, align: 'right' },
    ],
    [],
  );

  const rows: TableProps['data'] = voterTransactions.map(voterTxs => {
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
      action = voterTxs.support ? t('voterDetail.receivedVotes') : t('voterDetail.lostVotes');
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
        value: uid(action),
        align: 'left',
      },
      {
        key: 'age',
        render: () => t('voterDetail.readableAge', { age: voterTxs.blockTimestamp }),
        value: uid(voterTxs.blockTimestamp),
        align: 'left',
      },
      {
        key: 'amount',
        render: () =>
          convertWeiToTokens({
            valueWei: amountWei,
            tokenId: 'xvs',
            minimizeDecimals: true,
            returnInReadableFormat: true,
          }),
        value: uid(amountWei.toFixed()),
        align: 'right',
      },
    ];
  });

  return (
    <Paper css={styles.root} className={className}>
      <Typography css={styles.horizontalPadding} variant="h4">
        {t('voterDetail.transactions')}
      </Typography>
      {voterTransactions && voterTransactions.length ? (
        <Table
          columns={columns}
          data={rows}
          rowKeyIndex={1}
          tableCss={styles.table}
          cardsCss={styles.cards}
          css={styles.cardContentGrid}
        />
      ) : (
        <Spinner />
      )}
      <AnchorButton
        css={styles.horizontalPadding}
        variant="secondary"
        href={generateBscScanUrl(address, 'address')}
      >
        {t('voterDetail.viewAll')}
      </AnchorButton>
    </Paper>
  );
};

export default Transactions;
