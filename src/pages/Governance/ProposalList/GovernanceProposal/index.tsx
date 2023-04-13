/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import {
  ActiveVotingProgress,
  Countdown,
  Icon,
  IconName,
  ProposalCard,
  ProposalTypeChip,
} from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalState, ProposalType, VoteSupport } from 'types';

import { useGetVoteReceipt } from 'clients/api';
import { GreenPulse } from 'components/LottieAnimation';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

// Translation keys: do not remove this comment
// t('voteProposalUi.activeUntilDate')
// t('voteProposalUi.cancelledDate')
// t('voteProposalUi.executedDate')
// t('voteProposalUi.queuedUntilDate')
// t('voteProposalUi.defeatedDate')

interface StateCard {
  state: ProposalState | undefined;
}

const StatusCard: React.FC<StateCard> = ({ state }) => {
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
  if (state !== 'Active' && state) {
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

interface GovernanceProposalProps {
  className?: string;
  proposalId: number;
  proposalTitle: string;
  proposalState: ProposalState;
  endDate?: Date;
  cancelDate?: Date;
  queuedDate?: Date;
  executedDate?: Date;
  userVoteStatus?: VoteSupport;
  forVotesWei?: BigNumber;
  againstVotesWei?: BigNumber;
  abstainedVotesWei?: BigNumber;
  isUserConnected: boolean;
  proposalType: ProposalType;
}

const GovernanceProposalUi: React.FC<GovernanceProposalProps> = ({
  className,
  proposalId,
  proposalTitle,
  proposalState,
  executedDate,
  queuedDate,
  cancelDate,
  endDate,
  userVoteStatus,
  forVotesWei,
  againstVotesWei,
  abstainedVotesWei,
  isUserConnected,
  proposalType,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const voteStatusText = useMemo(() => {
    switch (userVoteStatus) {
      case 'FOR':
        return t('voteProposalUi.voteStatus.votedFor');
      case 'AGAINST':
        return t('voteProposalUi.voteStatus.votedAgainst');
      case 'ABSTAIN':
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

  const [statusDate, statusKey] = useMemo(() => {
    switch (proposalState) {
      case 'Active':
        return [endDate, 'voteProposalUi.activeUntilDate'];
      case 'Canceled':
        return [cancelDate, 'voteProposalUi.cancelledDate'];
      case 'Executed':
        return [executedDate, 'voteProposalUi.executedDate'];
      case 'Queued':
        return [queuedDate, 'voteProposalUi.queuedUntilDate'];
      case 'Defeated':
        return [endDate, 'voteProposalUi.defeatedDate'];
      default:
        return [undefined, undefined];
    }
  }, [proposalState]);

  return (
    <ProposalCard
      className={className}
      linkTo={routes.governanceProposal.path.replace(':proposalId', proposalId.toString())}
      proposalNumber={proposalId}
      headerRightItem={
        isUserConnected ? <Typography variant="small2">{voteStatusText}</Typography> : undefined
      }
      headerLeftItem={
        proposalType !== ProposalType.NORMAL ? (
          <ProposalTypeChip proposalType={proposalType} />
        ) : undefined
      }
      title={proposalTitle}
      contentRightItem={
        proposalState === 'Active' ? (
          <ActiveVotingProgress
            votedForWei={forVotesWei}
            votedAgainstWei={againstVotesWei}
            abstainedWei={abstainedVotesWei}
            votedTotalWei={votedTotalWei}
          />
        ) : (
          <StatusCard state={proposalState} />
        )
      }
      footer={
        statusDate && statusKey ? (
          <div css={styles.timestamp}>
            <Typography variant="small2">
              {proposalState === 'Active' && (
                <div css={styles.greenPulseContainer}>
                  <GreenPulse css={styles.greenPulse} />
                </div>
              )}
              <Trans
                i18nKey={statusKey}
                components={{
                  Date: <Typography variant="small2" color="textPrimary" />,
                }}
                values={{
                  date: statusDate,
                }}
              />
            </Typography>

            <Countdown date={statusDate} />
          </div>
        ) : undefined
      }
      data-testid={TEST_IDS.governanceProposal(proposalId.toString())}
    />
  );
};

const GovernanceProposal: React.FC<
  Omit<GovernanceProposalProps, 'userVoteStatus' | 'isUserConnected'>
> = ({ proposalId, ...props }) => {
  const { accountAddress } = useAuth();

  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId, accountAddress },
    { enabled: !!accountAddress },
  );

  return (
    <GovernanceProposalUi
      userVoteStatus={userVoteReceipt?.voteSupport}
      proposalId={proposalId}
      isUserConnected={!!accountAddress}
      {...props}
    />
  );
};

export default GovernanceProposal;
