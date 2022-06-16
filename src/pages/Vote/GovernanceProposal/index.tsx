/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { SerializedStyles } from '@emotion/react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { ProposalState } from 'types';
import { ActiveChip, Chip, Countdown, Icon, IconName } from 'components';
import { ActiveVotingProgress } from './ActiveVotingProgress';
import { useStyles } from './styles';

interface IStateCard {
  state: ProposalState;
}

const StatusCard: React.FC<IStateCard> = ({ state }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const statusContent: Record<
    Exclude<ProposalState, 'Active'>,
    {
      iconWrapperCss: SerializedStyles;
      iconName: IconName;
      iconCss?: SerializedStyles;
      label: string;
    }
  > = useMemo(
    () => ({
      Queued: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label: t('voteProposalUi.statusCard.queued'),
      },
      Pending: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label: t('voteProposalUi.statusCard.pending'),
      },
      Executed: {
        iconWrapperCss: styles.iconMarkWrapper,
        iconName: 'mark',
        iconCss: styles.iconCheck,
        label: t('voteProposalUi.statusCard.executed'),
      },
      Defeated: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'close',
        label: t('voteProposalUi.statusCard.defeated'),
      },
      Succeeded: {
        iconWrapperCss: styles.iconInfoWrapper,
        iconName: 'exclamation',
        label: t('voteProposalUi.statusCard.readyToQueue'),
      },
      Expired: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'close',
        label: t('voteProposalUi.statusCard.expired'),
      },
      Canceled: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'close',
        label: t('voteProposalUi.statusCard.cancelled'),
      },
    }),
    [],
  );
  if (state !== 'Active') {
    return (
      <>
        <div css={[styles.iconWrapper, statusContent[state].iconWrapperCss]}>
          <Icon
            css={[styles.icon, statusContent[state].iconCss]}
            name={statusContent[state].iconName}
          />
        </div>
        <Typography css={styles.statusText} variant="body2">
          {statusContent[state].label}
        </Typography>
      </>
    );
  }
  return null;
};

type UserVoteStatus = 'votedFor' | 'votedAgainst' | 'abstained';

interface IGovernanceProposalProps {
  className?: string;
  proposalNumber: number;
  proposalTitle: string;
  proposalState: ProposalState;
  endDate: Date;
  userVoteStatus?: UserVoteStatus;
  forVotesWei?: BigNumber;
  againstVotesWei?: BigNumber;
  abstainedVotesWei?: BigNumber;
}

const GovernanceProposal: React.FC<IGovernanceProposalProps> = ({
  className,
  proposalNumber,
  proposalTitle,
  proposalState,
  endDate,
  userVoteStatus,
  forVotesWei,
  againstVotesWei,
  abstainedVotesWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const voteStatusText = useMemo(() => {
    switch (userVoteStatus) {
      case 'votedFor':
        return t('voteProposalUi.voteStatus.votedFor');
      case 'votedAgainst':
        return t('voteProposalUi.voteStatus.votedAgainst');
      case 'abstained':
        return t('voteProposalUi.voteStatus.abstained');
      default:
        return t('voteProposalUi.voteStatus.notVoted');
    }
  }, [userVoteStatus]);

  const votedTotalWei = BigNumber.sum.apply(null, [
    forVotesWei || 0,
    againstVotesWei || 0,
    abstainedVotesWei || 0,
  ]);

  return (
    <Paper className={className} css={styles.root}>
      <Grid container>
        <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
          <div css={styles.cardHeader}>
            <div>
              <Chip text={`#${proposalNumber}`} />
              {proposalState === 'Active' && (
                <ActiveChip text={t('voteProposalUi.proposalState.active')} />
              )}
            </div>

            <Typography variant="small2">{voteStatusText}</Typography>
          </div>

          <Typography variant="h4" css={styles.cardTitle}>
            {proposalTitle}
          </Typography>

          <div css={styles.cardFooter}>
            {endDate.getMilliseconds() > Date.now() && (
              <Typography variant="small2">
                {t('voteProposalUi.activeUntil')}
                <Typography css={styles.activeUntilDate} variant="small2" color="textPrimary">
                  {t('voteProposalUi.activeUntilDate', { date: endDate })}
                </Typography>
              </Typography>
            )}

            <Countdown date={endDate} />
          </div>
        </Grid>
        <Grid css={[styles.gridItem, styles.gridItemRight]} item xs={12} sm={4}>
          {proposalState === 'Active' && (
            <ActiveVotingProgress
              votedForWei={forVotesWei}
              votedAgainstWei={againstVotesWei}
              abstainedWei={abstainedVotesWei}
              votedTotalWei={votedTotalWei}
            />
          )}
          <StatusCard state={proposalState} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GovernanceProposal;
