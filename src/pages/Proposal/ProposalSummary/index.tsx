/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import { Paper, Typography } from '@mui/material';
import { ActiveChip, BscLink, Chip, Countdown, PrimaryButton, SecondaryButton } from 'components';
import { AuthContext } from 'context/AuthContext';
import { useCancelProposal, useQueueProposal, useExectueProposal } from 'clients/api';
import { IProposal } from 'types';
import { useTranslation } from 'translation';
import Stepper from './Stepper';
import { useStyles } from './styles';

interface IProposalSummaryUiProps {
  className?: string;
  proposal: IProposal;
}

interface IProposalSummaryContainerProps {
  cancelProposal: () => void;
  executeProposal: () => void;
  queueProposal: () => void;
  isCancelProposalLoading: boolean;
  isExecuteProposalLoading: boolean;
  isQueueProposalLoading: boolean;
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
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
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

  let updateProposalButton;
  let transactionHash = startTxHash;
  switch (state) {
    case 'Active':
      updateProposalButton = (
        <SecondaryButton
          onClick={cancelProposal}
          css={styles.updateProposalButton}
          loading={isCancelProposalLoading}
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
          onClick={queueProposal}
          css={styles.updateProposalButton}
          loading={isQueueProposalLoading}
        >
          {t('voteProposalUi.queue')}
        </PrimaryButton>
      );
      break;
    case 'Queued':
      updateProposalButton = (
        <PrimaryButton
          onClick={executeProposal}
          css={styles.updateProposalButton}
          loading={isExecuteProposalLoading}
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
          <Countdown date={endDate} css={styles.countdown} />
        </div>
        <div css={styles.content}>
          <div>
            <Typography variant="h3" css={styles.title}>
              {title}
            </Typography>
            {transactionHash && (
              <BscLink text={createdTxHash} urlType="tx" hash={transactionHash} />
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
  const { mutateAsync: cancelProposal, isLoading: isCancelProposalLoading } = useCancelProposal();
  const { mutateAsync: executeProposal, isLoading: isExecuteProposalLoading } =
    useExectueProposal();
  const { mutateAsync: queueProposal, isLoading: isQueueProposalLoading } = useQueueProposal();

  const handleCancelProposal = () =>
    cancelProposal({ proposalId: proposal.id, accountAddress: account?.address || '' });
  const handleExecuteProposal = () =>
    executeProposal({ proposalId: proposal.id, accountAddress: account?.address || '' });
  const handleQueueProposal = () =>
    queueProposal({ proposalId: proposal.id, accountAddress: account?.address || '' });

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
    />
  );
};

export default ProposalSummary;
