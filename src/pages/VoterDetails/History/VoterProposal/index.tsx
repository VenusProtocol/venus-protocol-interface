/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { ProposalState, VoteSupport } from 'types';
import {
  ActiveVotingProgress,
  ActiveChip,
  ErrorChip,
  InactiveChip,
  BlueChip,
  Chip,
} from 'components';
import Path from 'constants/path';
import { useStyles } from './styles';

interface IGovernanceProposalProps {
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

const GovernanceProposal: React.FC<IGovernanceProposalProps> = ({
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
  const voteChip = useMemo(() => {
    switch (userVoteStatus) {
      case 'FOR':
        return <ActiveChip text={t('voteProposalUi.voteStatus.votedFor')} />;
      case 'AGAINST':
        return <ErrorChip text={t('voteProposalUi.voteStatus.votedAgainst')} />;
      case 'ABSTAIN':
        return <InactiveChip text={t('voteProposalUi.voteStatus.abstained')} />;
      default:
        return t('voteProposalUi.voteStatus.notVoted');
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
                Span: <Typography color="textPrimary" />,
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
                Span: <Typography color="textPrimary" />,
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
                Span: <Typography color="textPrimary" />,
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
                Span: <Typography color="textPrimary" />,
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
                Span: <Typography color="textPrimary" />,
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
                Span: <Typography variant="small2" color="textPrimary" />,
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
    <Paper
      className={className}
      css={styles.root}
      component={({ children, ...props }) => (
        <div {...props}>
          <Link to={Path.VOTE_PROPOSAL_DETAILS.replace(':id', proposalNumber.toString())}>
            {children}
          </Link>
        </div>
      )}
    >
      <Grid container>
        <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
          <div css={styles.cardHeader}>
            <div>
              <Chip text={`#${proposalNumber}`} />
              {stateChip}
            </div>

            {voteChip}
          </div>

          <Typography variant="h4" css={styles.cardTitle} color="textPrimary">
            {proposalTitle}
          </Typography>

          <Typography variant="small2" component="span">
            {stateTimestamp}
          </Typography>
        </Grid>
        <Grid css={[styles.gridItem, styles.gridItemRight]} item xs={12} sm={4}>
          <ActiveVotingProgress
            votedForWei={forVotesWei}
            votedAgainstWei={againstVotesWei}
            abstainedWei={abstainedVotesWei}
            votedTotalWei={votedTotalWei}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GovernanceProposal;
