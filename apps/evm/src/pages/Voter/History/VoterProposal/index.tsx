/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import {
  ActiveChip,
  ActiveVotingProgress,
  BlueChip,
  ErrorChip,
  InactiveChip,
  ProposalCard,
} from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { ProposalState, type Token, VoteSupport } from 'types';

import { useStyles } from './styles';

interface VoterProposalProps {
  className?: string;
  proposalNumber: number;
  proposalTitle: string;
  proposalState: ProposalState;
  userVoteStatus?: VoteSupport;
  forVotesMantissa?: BigNumber;
  againstVotesMantissa?: BigNumber;
  abstainedVotesMantissa?: BigNumber;
  endDate: Date | undefined;
  createdDate: Date | undefined;
  cancelDate: Date | undefined;
  queuedDate: Date | undefined;
  executedDate: Date | undefined;
  xvs?: Token;
}

const VoterProposal: React.FC<VoterProposalProps> = ({
  className,
  proposalNumber,
  proposalTitle,
  proposalState,
  userVoteStatus,
  forVotesMantissa,
  againstVotesMantissa,
  abstainedVotesMantissa,
  createdDate,
  cancelDate,
  queuedDate,
  endDate,
  executedDate,
  xvs,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();
  const voteChipText = useMemo(() => {
    switch (userVoteStatus) {
      case VoteSupport.For:
        return <ActiveChip text={t('voteProposalUi.voteStatus.votedFor')} />;
      case VoteSupport.Against:
        return <ErrorChip text={t('voteProposalUi.voteStatus.votedAgainst')} />;
      case VoteSupport.Abstain:
        return <InactiveChip text={t('voteProposalUi.voteStatus.abstained')} />;
      default:
        return <Typography variant="small2">{t('voteProposalUi.voteStatus.notVoted')}</Typography>;
    }
  }, [userVoteStatus, t]);

  const votedTotalMantissa = BigNumber.sum.apply(null, [
    forVotesMantissa || 0,
    againstVotesMantissa || 0,
    abstainedVotesMantissa || 0,
  ]);

  const [stateChip, stateTimestamp] = useMemo(() => {
    switch (proposalState) {
      case ProposalState.Active:
        return [
          <ActiveChip text={t('proposalState.active')} />,
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
      case ProposalState.Canceled:
        return [
          <InactiveChip text={t('proposalState.canceled')} />,
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
      case ProposalState.Succeeded:
        return [
          <ActiveChip text={t('proposalState.succeeded')} />,
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
      case ProposalState.Queued:
        return [
          <InactiveChip text={t('proposalState.queued')} />,
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
      case ProposalState.Defeated:
        return [
          <ErrorChip text={t('proposalState.defeated')} />,
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
      case ProposalState.Expired:
        return [
          <ErrorChip text={t('proposalState.expired')} />,
          endDate && (
            <Trans
              i18nKey="voteProposalUi.proposalState.expiredTimestamp"
              components={{
                Span: <Typography variant="small2" color="textPrimary" component="span" />,
              }}
              values={{
                date: endDate,
              }}
            />
          ),
        ];
      case ProposalState.Executed:
        return [
          <BlueChip text={t('proposalState.executed')} />,
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
  }, [proposalState, Trans, cancelDate, createdDate, executedDate, endDate, queuedDate, t]);

  return (
    <ProposalCard
      css={styles.root}
      className={className}
      linkTo={routes.governanceProposal.path.replace(':proposalId', proposalNumber.toString())}
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
          xvs={xvs}
          votedForMantissa={forVotesMantissa}
          votedAgainstMantissa={againstVotesMantissa}
          abstainedMantissa={abstainedVotesMantissa}
          votedTotalMantissa={votedTotalMantissa}
        />
      }
    />
  );
};

export default VoterProposal;
