/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { useStyles } from './styles';

type ProposalStatus = 'active' | 'queued' | 'readyToExecute' | 'executed' | 'cancelled';

interface IStatusCard {
  status: ProposalStatus;
  votedFor?: string;
  votedAgainst?: string;
  abstain?: string;
}

const StatusCard: React.FC<IStatusCard> = ({ status, votedFor, votedAgainst, abstain }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  switch (status) {
    case 'active':
      return (
        <>
          <div css={styles.voteRow}>
            <Typography variant="small2" color="textPrimary">
              {t('voteProposalUi.statusCard.for')}
            </Typography>

            <Typography variant="small2" color="textPrimary">
              {votedFor}
            </Typography>
          </div>
          <ProgressBar value={20} step={1} ariaLabel="progress" min={1} max={100} />

          <div css={styles.voteRow}>
            <Typography variant="small2" color="textPrimary">
              {t('voteProposalUi.statusCard.against')}
            </Typography>

            <Typography variant="small2" color="textPrimary">
              {votedAgainst}
            </Typography>
          </div>
          <ProgressBar value={20} step={1} ariaLabel="progress" min={1} max={100} />

          <div css={styles.voteRow}>
            <Typography variant="small2" color="textPrimary">
              {t('voteProposalUi.statusCard.abstain')}
            </Typography>

            <Typography variant="small2" color="textPrimary">
              {abstain}
            </Typography>
          </div>
          <ProgressBar value={5} step={1} ariaLabel="progress" min={1} max={100} />
        </>
      );
    case 'queued':
      return (
        <>
          <div css={[styles.iconWrapper, styles.iconDotsWrapper]}>
            <Icon css={styles.icon} name="dots" />
          </div>
          <Typography css={styles.statusText} variant="body2">
            {t('voteProposalUi.statusCard.queued')}
          </Typography>
        </>
      );
    case 'readyToExecute':
      return (
        <>
          <div css={[styles.iconWrapper, styles.iconInfoWrapper]}>
            <Icon css={styles.icon} name="exclamation" />
          </div>
          <Typography css={styles.statusText} variant="body2">
            {t('voteProposalUi.statusCard.readyToExecute')}
          </Typography>
        </>
      );
    case 'executed':
      return (
        <>
          <div css={[styles.iconWrapper, styles.iconMarkWrapper]}>
            <Icon css={[styles.icon, styles.iconCheck]} name="mark" />
          </div>
          <Typography css={styles.statusText} variant="body2">
            {t('voteProposalUi.statusCard.executed')}
          </Typography>
        </>
      );
    default:
    case 'cancelled':
      return (
        <>
          <div css={[styles.iconWrapper, styles.iconCloseWrapper]}>
            <Icon css={styles.icon} name="close" />
          </div>
          <Typography css={styles.statusText} variant="body2">
            {t('voteProposalUi.statusCard.cancelled')}
          </Typography>
        </>
      );
  }
};

type VoteStatus = 'votedFor' | 'votedAgainst' | 'abstained';

interface IVoteProposalUiProps {
  className?: string;
  proposalNumber: number;
  proposalText: string;
  proposalStatus: ProposalStatus;
  voteStatus?: VoteStatus;
  votedFor?: string;
  votedAgainst?: string;
  abstain?: string;
}

export const VoteProposalUi: React.FC<IVoteProposalUiProps> = ({
  className,
  proposalNumber,
  proposalText,
  proposalStatus,
  voteStatus,
  votedFor,
  votedAgainst,
  abstain,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const voteStatusText = useMemo(() => {
    switch (voteStatus) {
      case 'votedFor':
        return t('voteProposalUi.voteStatus.votedFor');
      case 'votedAgainst':
        return t('voteProposalUi.voteStatus.votedAgainst');
      case 'abstained':
        return t('voteProposalUi.voteStatus.abstained');
      default:
        return t('voteProposalUi.voteStatus.notVoted');
    }
  }, [voteStatus]);

  return (
    <Paper className={className} css={styles.root}>
      <Grid container>
        <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
          <div css={styles.cardHeader}>
            <div css={styles.cardBadges}>
              <Typography
                variant="small2"
                color="textPrimary"
                css={[styles.cardBadgeItem, styles.cardBadgeNumber]}
              >
                #{proposalNumber}
              </Typography>
              {proposalStatus === 'active' && (
                <Typography
                  variant="small2"
                  color="textPrimary"
                  css={[styles.cardBadgeItem, styles.cardBadgeActive]}
                >
                  {t('voteProposalUi.proposalStatus.active')}
                </Typography>
              )}
            </div>

            <Typography variant="small2">{voteStatusText}</Typography>
          </div>

          <Typography variant="h4" css={styles.cardTitle}>
            {proposalText}
          </Typography>

          <div css={styles.cardFooter}>
            <Typography variant="small2">
              {t('voteProposalUi.activeUntil')}
              <Typography variant="small2" color="textPrimary">
                27 Jun 13:54
              </Typography>
            </Typography>

            <Typography color="textPrimary" variant="small2">
              27h : 13m : 54s
            </Typography>
          </div>
        </Grid>
        <Grid css={[styles.gridItem, styles.gridItemRight]} item xs={12} sm={4}>
          <StatusCard
            status={proposalStatus}
            votedFor={votedFor}
            votedAgainst={votedAgainst}
            abstain={abstain}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
