/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import {
  BscLink,
  Chip,
  Countdown,
  PrimaryButton,
  ProposalTypeChip,
  SecondaryButton,
} from 'components';
import isAfter from 'date-fns/isAfter';
import { ContractReceipt } from 'ethers';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Proposal, ProposalType } from 'types';

import {
  useCancelProposal,
  useExecuteProposal,
  useGetCurrentVotes,
  useGetProposalEta,
  useGetProposalThreshold,
  useQueueProposal,
} from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import Stepper from './Stepper';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalSummaryUiProps {
  className?: string;
  proposal: Proposal;
}

interface ProposalSummaryContainerProps {
  cancelProposal: () => Promise<ContractReceipt>;
  executeProposal: () => Promise<ContractReceipt>;
  queueProposal: () => Promise<ContractReceipt>;
  isCancelProposalLoading: boolean;
  isExecuteProposalLoading: boolean;
  isQueueProposalLoading: boolean;
  canCancelProposal: boolean;
  proposalEta?: Date;
}

export const ProposalSummaryUi: React.FC<
  ProposalSummaryUiProps & ProposalSummaryContainerProps
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
  proposalEta,
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
    proposalType,
  } = proposal;

  const handleCancelProposal = async () => {
    await handleTransactionMutation({
      mutate: cancelProposal,
      successTransactionModalProps: contractReceipt => ({
        title: t('vote.theProposalWasCancelled'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  const handleQueueProposal = async () => {
    await handleTransactionMutation({
      mutate: queueProposal,
      successTransactionModalProps: contractReceipt => ({
        title: t('vote.theProposalWasQueued'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  const handleExecuteProposal = async () => {
    await handleTransactionMutation({
      mutate: executeProposal,
      successTransactionModalProps: contractReceipt => ({
        title: t('vote.theProposalWasExecuted'),
        content: t('vote.pleaseAllowTimeForConfirmation'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  let updateProposalButton;
  let transactionHash = startTxHash;
  const isExecuteEtaInFuture = !!proposalEta && isAfter(proposalEta, new Date());

  switch (state) {
    case 'Active':
      updateProposalButton = (
        <SecondaryButton
          onClick={handleCancelProposal}
          css={styles.updateProposalButton}
          loading={isCancelProposalLoading}
          data-testid={TEST_IDS.cancelButton}
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
          data-testid={TEST_IDS.queueButton}
        >
          {t('voteProposalUi.queue')}
        </PrimaryButton>
      );
      transactionHash = endTxHash;
      break;
    case 'Queued':
      if (!isExecuteEtaInFuture) {
        updateProposalButton = (
          <PrimaryButton
            onClick={handleExecuteProposal}
            css={styles.updateProposalButton}
            loading={isExecuteProposalLoading}
            data-testid={TEST_IDS.executeButton}
          >
            {t('voteProposalUi.execute')}
          </PrimaryButton>
        );
      }

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

  const countdownData = useMemo(() => {
    if (state === 'Active' && endDate) {
      return {
        date: endDate,
        // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
        // t('voteProposalUi.activeUntilDate')
        i18nKey: 'voteProposalUi.activeUntilDate',
      };
    }

    if (state === 'Queued' && isExecuteEtaInFuture) {
      return {
        date: proposalEta,
        // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
        // t('voteProposalUi.timeUntilExecutable')
        i18nKey: 'voteProposalUi.timeUntilExecutable',
      };
    }
  }, [state, endDate?.getTime(), proposalEta?.getTime()]);

  return (
    <Paper css={styles.root} className={className}>
      <div css={styles.leftSection}>
        <div css={styles.topRow}>
          <div css={styles.topRowLeftColumn}>
            <Chip text={`#${id}`} css={styles.chipSpace} />

            {proposalType !== ProposalType.NORMAL && (
              <ProposalTypeChip proposalType={proposalType} />
            )}
          </div>

          {countdownData && (
            <div>
              <Typography variant="small2" css={styles.countdownLabel}>
                <Trans
                  i18nKey={countdownData.i18nKey}
                  components={{
                    Date: <Typography variant="small2" color="textPrimary" />,
                  }}
                  values={{
                    date: endDate,
                  }}
                />
              </Typography>
              &nbsp;
              <Countdown date={countdownData.date} css={styles.countdown} />
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
                text={transactionHash}
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

const ProposalSummary: React.FC<ProposalSummaryUiProps> = ({ className, proposal }) => {
  const { accountAddress } = useAuth();

  const { mutateAsync: cancelProposal, isLoading: isCancelProposalLoading } = useCancelProposal();
  const { mutateAsync: executeProposal, isLoading: isExecuteProposalLoading } =
    useExecuteProposal();
  const { mutateAsync: queueProposal, isLoading: isQueueProposalLoading } = useQueueProposal();

  const handleCancelProposal = () => cancelProposal({ proposalId: proposal.id });
  const handleExecuteProposal = () => executeProposal({ proposalId: proposal.id });
  const handleQueueProposal = () => queueProposal({ proposalId: proposal.id });

  const { data: proposalThresholdData } = useGetProposalThreshold();

  const { data: getProposalEtaData } = useGetProposalEta({
    proposalId: proposal.id,
  });

  const { data: proposerVotesData } = useGetCurrentVotes(
    { accountAddress: proposal.proposer },
    { enabled: !!accountAddress },
  );

  const canCancelProposal =
    proposal.proposer === accountAddress ||
    (proposalThresholdData?.thresholdWei &&
      proposerVotesData?.votesWei.isLessThan(proposalThresholdData.thresholdWei));

  return (
    <ProposalSummaryUi
      className={className}
      proposal={proposal}
      proposalEta={getProposalEtaData?.eta}
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
