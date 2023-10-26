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
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalState, ProposalType, Token, VoteSupport } from 'types';

import { useGetVoteReceipt } from 'clients/api';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import greenPulseAnimation from './greenPulseAnimation.gif';
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
    Exclude<ProposalState, ProposalState.Active>,
    {
      iconWrapperCss: SerializedStyles;
      iconName: IconName;
      iconCss?: SerializedStyles;
      label: string;
    }
  > = useMemo(
    () => ({
      [ProposalState.Queued]: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label: t('voteProposalUi.statusCard.queued'),
      },
      [ProposalState.Pending]: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label: t('voteProposalUi.statusCard.pending'),
      },
      [ProposalState.Executed]: {
        iconWrapperCss: styles.iconMarkWrapper,
        iconName: 'mark',
        iconCss: styles.iconCheck,
        label: t('voteProposalUi.statusCard.executed'),
      },
      [ProposalState.Defeated]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label: t('voteProposalUi.statusCard.defeated'),
      },
      [ProposalState.Succeeded]: {
        iconWrapperCss: styles.iconInfoWrapper,
        iconName: 'exclamation',
        label: t('voteProposalUi.statusCard.readyToQueue'),
      },
      [ProposalState.Expired]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label: t('voteProposalUi.statusCard.expired'),
      },
      [ProposalState.Canceled]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label: t('voteProposalUi.statusCard.cancelled'),
      },
    }),
    [],
  );
  if (state !== undefined && state !== ProposalState.Active) {
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
  forVotesMantissa?: BigNumber;
  againstVotesMantissa?: BigNumber;
  abstainedVotesMantissa?: BigNumber;
  isUserConnected: boolean;
  proposalType: ProposalType;
  xvs?: Token;
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
  forVotesMantissa,
  againstVotesMantissa,
  abstainedVotesMantissa,
  isUserConnected,
  proposalType,
  xvs,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const voteStatusText = useMemo(() => {
    switch (userVoteStatus) {
      case VoteSupport.For:
        return t('voteProposalUi.voteStatus.votedFor');
      case VoteSupport.Against:
        return t('voteProposalUi.voteStatus.votedAgainst');
      case VoteSupport.Abstain:
        return t('voteProposalUi.voteStatus.abstained');
      default:
        return t('voteProposalUi.voteStatus.notVoted');
    }
  }, [userVoteStatus]);

  const votedTotalMantissa = BigNumber.sum.apply(null, [
    forVotesMantissa || 0,
    againstVotesMantissa || 0,
    abstainedVotesMantissa || 0,
  ]);

  const [statusDate, statusKey] = useMemo(() => {
    switch (proposalState) {
      case ProposalState.Active:
        return [endDate, 'voteProposalUi.activeUntilDate'];
      case ProposalState.Canceled:
        return [cancelDate, 'voteProposalUi.cancelledDate'];
      case ProposalState.Executed:
        return [executedDate, 'voteProposalUi.executedDate'];
      case ProposalState.Queued:
        return [queuedDate, 'voteProposalUi.queuedUntilDate'];
      case ProposalState.Defeated:
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
        proposalState === ProposalState.Active ? (
          <ActiveVotingProgress
            votedForMantissa={forVotesMantissa}
            votedAgainstMantissa={againstVotesMantissa}
            abstainedMantissa={abstainedVotesMantissa}
            votedTotalMantissa={votedTotalMantissa}
            xvs={xvs}
          />
        ) : (
          <StatusCard state={proposalState} />
        )
      }
      footer={
        statusDate && statusKey ? (
          <div css={styles.timestamp}>
            <Typography variant="small2">
              {proposalState === ProposalState.Active && (
                <div css={styles.greenPulseContainer}>
                  <img
                    src={greenPulseAnimation}
                    css={styles.greenPulse}
                    alt={t('voteProposalUi.greenPulseAnimation.altText')}
                  />
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

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId, accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  return (
    <GovernanceProposalUi
      xvs={xvs}
      userVoteStatus={userVoteReceipt?.voteSupport}
      proposalId={proposalId}
      isUserConnected={!!accountAddress}
      {...props}
    />
  );
};

export default GovernanceProposal;
