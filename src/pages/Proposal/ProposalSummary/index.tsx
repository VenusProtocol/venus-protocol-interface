/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import type { TransactionReceipt } from 'web3-core';
import { Paper, Typography } from '@mui/material';
import { ActiveChip, BscLink, Chip, Countdown, PrimaryButton, SecondaryButton } from 'components';
import { AuthContext } from 'context/AuthContext';
import {
  useCancelProposal,
  useQueueProposal,
  useExecuteProposal,
  useGetProposalThreshold,
  useGetCurrentVotes,
} from 'clients/api';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import { IProposal } from 'types';
import { useTranslation } from 'translation';
import TEST_IDS from '../testIds';
import Stepper from './Stepper';
import { useStyles } from './styles';

interface IProposalSummaryUiProps {
  className?: string;
  proposal: IProposal;
}

interface IProposalSummaryContainerProps {
  cancelProposal: () => Promise<TransactionReceipt>;
  executeProposal: () => Promise<TransactionReceipt>;
  queueProposal: () => Promise<TransactionReceipt>;
  isCancelProposalLoading: boolean;
  isExecuteProposalLoading: boolean;
  isQueueProposalLoading: boolean;
  canCancelProposal: boolean;
}

export const ProposalSummaryUi: React.FC<
  IProposalSummaryUiProps & IProposalSummaryContainerProps
> = ({
  className,
  proposal,
  cancelProposal,
  queueProposal,
  executeProposal,
  isCancelProposalLoading,
  isExecuteProposalLoading,
  isQueueProposalLoading,
  canCancelProposal,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const {
    state,
    id,
    description: { title },
    createdDate,
    createdTxHash,
    startDate,
    startTxHash,
    cancelDate,
    cancelTxHash,
    queuedDate,
    queuedTxHash,
    executedDate,
    executedTxHash,
    endTxHash,
    endDate,
  } = proposal;

  const handleCancelProposal = async () => {
    await handleTransactionMutation({
      mutate: cancelProposal,
      successTransactionModalProps: transactionReceipt => ({
        title: t('vote.theProposalWasCancelled'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  const handleQueueProposal = async () => {
    await handleTransactionMutation({
      mutate: queueProposal,
      successTransactionModalProps: transactionReceipt => ({
        title: t('vote.theProposalWasQueued'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  const handleExecuteProposal = async () => {
    await handleTransactionMutation({
      mutate: executeProposal,
      successTransactionModalProps: transactionReceipt => ({
        title: t('vote.theProposalWasExecuted'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  let updateProposalButton;
  let transactionHash = startTxHash;

  switch (state) {
    case 'Active':
      updateProposalButton = (
        <SecondaryButton
          onClick={handleCancelProposal}
          css={styles.updateProposalButton}
          loading={isCancelProposalLoading}
          data-testid={TEST_IDS.proposalSummary.cancelButton}
          disabled={!canCancelProposal}
        >
          {t('voteProposalUi.cancel')}
        </SecondaryButton>
      );
      transactionHash = createdTxHash;
      break;
    case 'Canceled':
      transactionHash = cancelTxHash;
      break;
    case 'Succeeded':
      updateProposalButton = (
        <PrimaryButton
          onClick={handleQueueProposal}
          css={styles.updateProposalButton}
          loading={isQueueProposalLoading}
          data-testid={TEST_IDS.proposalSummary.queueButton}
        >
          {t('voteProposalUi.queue')}
        </PrimaryButton>
      );
      transactionHash = endTxHash;
      break;
    case 'Queued':
      updateProposalButton = (
        <PrimaryButton
          onClick={handleExecuteProposal}
          css={styles.updateProposalButton}
          loading={isExecuteProposalLoading}
          data-testid={TEST_IDS.proposalSummary.executeButton}
        >
          {t('voteProposalUi.execute')}
        </PrimaryButton>
      );
      transactionHash = queuedTxHash;
      break;
    case 'Defeated':
      transactionHash = endTxHash;
      break;
    case 'Executed':
      transactionHash = executedTxHash;
      break;
    // no default
  }

  return (
    <Paper css={styles.root} className={className}>
      <div css={styles.leftSection}>
        <div css={styles.topRow}>
          <div>
            <Chip text={`#${id}`} css={styles.chipSpace} />
            {state === 'Active' && <ActiveChip text={t('voteProposalUi.proposalState.active')} />}
          </div>

          {state === 'Active' && endDate && (
            <div>
              <Typography variant="small2">
                <Trans
                  i18nKey="voteProposalUi.activeUntilDate"
                  components={{
                    Date: <Typography variant="small2" color="textPrimary" />,
                  }}
                  values={{
                    date: endDate,
                  }}
                />
              </Typography>
              &nbsp;
              <Countdown date={endDate} css={styles.countdown} />
            </div>
          )}
        </div>

        <div css={styles.content}>
          <div>
            <Typography variant="h3" css={styles.title}>
              {title}
            </Typography>

            {transactionHash && (
              <BscLink
                text={createdTxHash}
                urlType="tx"
                hash={transactionHash}
                css={styles.transactionLink}
                ellipseBreakpoint="xxl"
              />
            )}
          </div>

          <div>{updateProposalButton}</div>
        </div>
      </div>

      <div css={styles.rightSection}>
        <Typography css={styles.rightTitle}>{t('voteProposalUi.proposalHistory')}</Typography>

        <Stepper
          createdDate={createdDate}
          startDate={startDate}
          cancelDate={cancelDate}
          queuedDate={queuedDate}
          executedDate={executedDate}
          endDate={endDate}
          state={state}
        />
      </div>
    </Paper>
  );
};

const ProposalSummary: React.FC<IProposalSummaryUiProps> = ({ className, proposal }) => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';

  const { mutateAsync: cancelProposal, isLoading: isCancelProposalLoading } = useCancelProposal();
  const { mutateAsync: executeProposal, isLoading: isExecuteProposalLoading } =
    useExecuteProposal();
  const { mutateAsync: queueProposal, isLoading: isQueueProposalLoading } = useQueueProposal();

  const handleCancelProposal = () => cancelProposal({ proposalId: proposal.id, accountAddress });
  const handleExecuteProposal = () => executeProposal({ proposalId: proposal.id, accountAddress });
  const handleQueueProposal = () => queueProposal({ proposalId: proposal.id, accountAddress });

  const { data: proposalThresholdWei } = useGetProposalThreshold();

  const { data: currentVotesWei } = useGetCurrentVotes(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const canCancelProposal =
    proposalThresholdWei && currentVotesWei?.isGreaterThanOrEqualTo(proposalThresholdWei);

  return (
    <ProposalSummaryUi
      className={className}
      proposal={proposal}
      cancelProposal={handleCancelProposal}
      executeProposal={handleExecuteProposal}
      queueProposal={handleQueueProposal}
      isCancelProposalLoading={isCancelProposalLoading}
      isExecuteProposalLoading={isExecuteProposalLoading}
      isQueueProposalLoading={isQueueProposalLoading}
      canCancelProposal={!!canCancelProposal}
    />
  );
};

export default ProposalSummary;
