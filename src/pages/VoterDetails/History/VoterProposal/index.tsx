/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import {
  ActiveChip,
  ActiveVotingProgress,
  BlueChip,
  ErrorChip,
  InactiveChip,
  ProposalCard,
} from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalState, VoteSupport } from 'types';

import { routes } from 'constants/routing';

import { useStyles } from './styles';

interface VoterProposalProps {
  className?: string;
  proposalNumber: number;
  proposalTitle: string;
  proposalState: ProposalState;
  userVoteStatus?: VoteSupport;
  forVotesWei?: BigNumber;
  againstVotesWei?: BigNumber;
  abstainedVotesWei?: BigNumber;
  endDate: Date | undefined;
  cancelDate: Date | undefined;
  queuedDate: Date | undefined;
  executedDate: Date | undefined;
}

const VoterProposal: React.FC<VoterProposalProps> = ({
  className,
  proposalNumber,
  proposalTitle,
  proposalState,
  userVoteStatus,
  forVotesWei,
  againstVotesWei,
  abstainedVotesWei,
  cancelDate,
  queuedDate,
  endDate,
  executedDate,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const voteChipText = useMemo(() => {
    switch (userVoteStatus) {
      case 'FOR':
        return <ActiveChip text={t('voteProposalUi.voteStatus.votedFor')} />;
      case 'AGAINST':
        return <ErrorChip text={t('voteProposalUi.voteStatus.votedAgainst')} />;
      case 'ABSTAIN':
        return <InactiveChip text={t('voteProposalUi.voteStatus.abstained')} />;
      default:
        return <Typography variant="small2">{t('voteProposalUi.voteStatus.notVoted')}</Typography>;
    }
  }, [userVoteStatus]);

  const votedTotalWei = BigNumber.sum.apply(null, [
    forVotesWei || 0,
    againstVotesWei || 0,
    abstainedVotesWei || 0,
  ]);

  const stateChip = useMemo(() => {
    switch (proposalState) {
      case 'Active':
        return <ActiveChip text={t('voteProposalUi.proposalState.active')} />;
      case 'Canceled':
        return <InactiveChip text={t('voteProposalUi.proposalState.canceled')} />;
      case 'Succeeded':
        return <ActiveChip text={t('voteProposalUi.proposalState.passed')} />;
      case 'Queued':
        return <InactiveChip text={t('voteProposalUi.proposalState.queued')} />;
      case 'Defeated':
        return <ErrorChip text={t('voteProposalUi.proposalState.defeated')} />;
      case 'Executed':
        return <BlueChip text={t('voteProposalUi.proposalState.executed')} />;
      default:
        return undefined;
    }
  }, [proposalState]);

  return (
    <ProposalCard
      css={styles.root}
      className={className}
      linkTo={routes.governanceProposal.path.replace(':proposalId', proposalNumber.toString())}
      proposalNumber={proposalNumber}
      headerLeftItem={stateChip}
      headerRightItem={voteChipText}
      title={proposalTitle}
      contentRightItem={
        <ActiveVotingProgress
          votedForWei={forVotesWei}
          votedAgainstWei={againstVotesWei}
          abstainedWei={abstainedVotesWei}
          votedTotalWei={votedTotalWei}
        />
      }
      proposalState={proposalState}
      endDate={endDate}
      cancelDate={cancelDate}
      queuedDate={queuedDate}
      executedDate={executedDate}
    />
  );
};

export default VoterProposal;
