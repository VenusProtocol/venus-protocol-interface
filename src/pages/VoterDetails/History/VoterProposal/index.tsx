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

import Path from 'constants/path';

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
  createdDate: Date | undefined;
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
  createdDate,
  cancelDate,
  queuedDate,
  endDate,
  executedDate,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
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

  const [stateChip, stateTimestamp] = useMemo(() => {
    switch (proposalState) {
      case 'Active':
        return [
          <ActiveChip text={t('voteProposalUi.proposalState.active')} />,
          createdDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.activeTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: createdDate,
              }}
            />
          ),
        ];
      case 'Canceled':
        return [
          <InactiveChip text={t('voteProposalUi.proposalState.canceled')} />,
          cancelDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.canceledTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: cancelDate,
              }}
            />
          ),
        ];
      case 'Succeeded':
        return [
          <ActiveChip text={t('voteProposalUi.proposalState.passed')} />,
          endDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.succeededTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: endDate,
              }}
            />
          ),
        ];
      case 'Queued':
        return [
          <InactiveChip text={t('voteProposalUi.proposalState.queued')} />,
          queuedDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.queuedTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: queuedDate,
              }}
            />
          ),
        ];
      case 'Defeated':
        return [
          <ErrorChip text={t('voteProposalUi.proposalState.defeated')} />,
          endDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.defeatedTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: endDate,
              }}
            />
          ),
        ];
      case 'Executed':
        return [
          <BlueChip text={t('voteProposalUi.proposalState.executed')} />,
          executedDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.executedTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: executedDate,
              }}
            />
          ),
        ];
      default:
        return [];
    }
  }, [proposalState]);

  return (
    <ProposalCard
      css={styles.root}
      className={className}
      linkTo={Path.GOVERNANCE_PROPOSAL_DETAILS.replace(':id', proposalNumber.toString())}
      proposalNumber={proposalNumber}
      headerLeftItem={stateChip}
      headerRightItem={voteChipText}
      title={proposalTitle}
      footer={
        <Typography variant="small2" component="span">
          {stateTimestamp}
        </Typography>
      }
      contentRightItem={
        <ActiveVotingProgress
          votedForWei={forVotesWei}
          votedAgainstWei={againstVotesWei}
          abstainedWei={abstainedVotesWei}
          votedTotalWei={votedTotalWei}
        />
      }
    />
  );
};

export default VoterProposal;
