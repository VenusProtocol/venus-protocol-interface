/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import { Checkbox, Select } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { TransactionEvent } from 'types';

import { useStyles } from './styles';

export const ALL_VALUE = 'All';

export interface FilterProps {
  eventType: TransactionEvent | typeof ALL_VALUE;
  setEventType: (eventType: TransactionEvent | typeof ALL_VALUE) => void;
  showOnlyMyTxns: boolean;
  setShowOnlyMyTxns: (showOnlyMyTxns: boolean) => void;
  walletConnected: boolean;
}

export const Filters: React.FC<FilterProps> = ({
  eventType,
  setEventType,
  showOnlyMyTxns,
  setShowOnlyMyTxns,
  walletConnected,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const selectOptions = [
    { label: t('history.all'), value: 'All' },
    { label: t('history.mint'), value: 'Mint' },
    { label: t('history.transfer'), value: 'Transfer' },
    { label: t('history.borrow'), value: 'Borrow' },
    { label: t('history.repayBorrow'), value: 'RepayBorrow' },
    { label: t('history.redeem'), value: 'Redeem' },
    { label: t('history.approval'), value: 'Approval' },
    { label: t('history.liquidateBorrow'), value: 'LiquidateBorrow' },
    { label: t('history.reservesAdded'), value: 'ReservesAdded' },
    { label: t('history.reservesReduced'), value: 'ReservesReduced' },
    { label: t('history.mintVAI'), value: 'MintVAI' },
    { label: t('history.withdraw'), value: 'Withdraw' },
    { label: t('history.repayVAI'), value: 'RepayVAI' },
    { label: t('history.deposit'), value: 'Deposit' },
    { label: t('history.voteCast'), value: 'VoteCast' },
    { label: t('history.proposalCreated'), value: 'ProposalCreated' },
    { label: t('history.proposalQueued'), value: 'ProposalQueued' },
    { label: t('history.proposalExecuted'), value: 'ProposalExecuted' },
    { label: t('history.proposalCanceled'), value: 'ProposalCanceled' },
  ];

  return (
    <Paper css={styles.root}>
      <div css={styles.myTransactions}>
        {walletConnected && (
          <>
            <Checkbox
              onChange={e => setShowOnlyMyTxns(e.target.checked)}
              value={showOnlyMyTxns}
              css={styles.checkbox}
            />
            <Typography variant="small2">{t('history.myTransactions')}</Typography>
          </>
        )}
      </div>

      <Select
        options={selectOptions}
        label={t('history.typeColon')}
        value={eventType}
        onChange={e => setEventType(e.target.value as TransactionEvent | typeof ALL_VALUE)}
        ariaLabel={t('history.type')}
        title={t('history.type')}
        css={styles.select}
      />
    </Paper>
  );
};
export default Filters;
