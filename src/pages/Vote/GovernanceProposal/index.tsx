/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import {
  ActiveChip,
  ActiveVotingProgress,
  Countdown,
  Icon,
  IconName,
  ProposalCard,
} from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalState, VoteSupport } from 'types';

import { useGetVoteReceipt } from 'clients/api';
import Path from 'constants/path';
import { AuthContext } from 'context/AuthContext';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

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
  endDate: Date | undefined;
  userVoteStatus?: VoteSupport;
  forVotesWei?: BigNumber;
  againstVotesWei?: BigNumber;
  abstainedVotesWei?: BigNumber;
}

const GovernanceProposalUi: React.FC<GovernanceProposalProps> = ({
  className,
  proposalId,
  proposalTitle,
  proposalState,
  endDate,
  userVoteStatus,
  forVotesWei,
  againstVotesWei,
  abstainedVotesWei,
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

  return (
    <ProposalCard
      className={className}
      linkTo={Path.GOVERNANCE_PROPOSAL_DETAILS.replace(':id', proposalId.toString())}
      proposalNumber={proposalId}
      headerRightItem={
        proposalState === 'Active' ? (
          <ActiveChip text={t('voteProposalUi.proposalState.active')} />
        ) : undefined
      }
      headerLeftItem={<Typography variant="small2">{voteStatusText}</Typography>}
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
        endDate && proposalState === 'Active' ? (
          <div css={styles.timestamp}>
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

            <Countdown date={endDate} />
          </div>
        ) : undefined
      }
      data-testid={TEST_IDS.governanceProposal(proposalId.toString())}
    />
  );
};

const GovernanceProposal: React.FC<Omit<GovernanceProposalProps, 'userVoteStatus'>> = ({
  proposalId,
  ...props
}) => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address;

  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId, accountAddress },
    { enabled: !!accountAddress },
  );

  return (
    <GovernanceProposalUi
      userVoteStatus={userVoteReceipt?.voteSupport}
      proposalId={proposalId}
      {...props}
    />
  );
};

export default GovernanceProposal;
