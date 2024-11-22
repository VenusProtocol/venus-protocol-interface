/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { ActiveVotingProgress, Countdown, ProposalCard, ProposalTypeChip } from 'components';
import { routes } from 'constants/routing';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  type Proposal,
  ProposalState,
  ProposalType,
  RemoteProposalState,
  type Token,
  VoteSupport,
} from 'types';

import { Status } from './Status';
import greenPulseAnimation from './greenPulseAnimation.gif';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

// Translation keys: do not remove this comment
// t('voteProposalUi.activeUntilDate')
// t('voteProposalUi.canceledDate')
// t('voteProposalUi.executedDate')
// t('voteProposalUi.queuedUntilDate')
// t('voteProposalUi.defeatedDate')
// t('voteProposalUi.expiredDate')

interface GovernanceProposalProps extends Proposal {
  className?: string;
  isUserConnected: boolean;
  xvs?: Token;
}

const GovernanceProposalUi: React.FC<GovernanceProposalProps> = ({
  className,
  proposalId,
  description,
  state,
  remoteProposals,
  executedDate,
  executionEtaDate,
  cancelDate,
  expiredDate,
  endDate,
  userVoteSupport,
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
    switch (userVoteSupport) {
      case VoteSupport.For:
        return t('voteProposalUi.voteStatus.votedFor');
      case VoteSupport.Against:
        return t('voteProposalUi.voteStatus.votedAgainst');
      case VoteSupport.Abstain:
        return t('voteProposalUi.voteStatus.abstained');
      default:
        return t('voteProposalUi.voteStatus.notVoted');
    }
  }, [userVoteSupport, t]);

  const votedTotalMantissa = BigNumber.sum.apply(null, [
    forVotesMantissa || 0,
    againstVotesMantissa || 0,
    abstainedVotesMantissa || 0,
  ]);

  const [statusDate, statusKey] = useMemo(() => {
    switch (state) {
      case ProposalState.Active:
        return [endDate, 'voteProposalUi.activeUntilDate'];
      case ProposalState.Canceled:
        return [cancelDate, 'voteProposalUi.canceledDate'];
      case ProposalState.Executed:
        return [executedDate, 'voteProposalUi.executedDate'];
      case ProposalState.Queued:
        return [executionEtaDate, 'voteProposalUi.queuedUntilDate'];
      case ProposalState.Defeated:
        return [endDate, 'voteProposalUi.defeatedDate'];
      case ProposalState.Expired:
        return [expiredDate, 'voteProposalUi.expiredDate'];
      default:
        return [undefined, undefined];
    }
  }, [state, cancelDate, executedDate, endDate, executionEtaDate, expiredDate]);

  const contentRightItemDom = useMemo(() => {
    if (state === ProposalState.Active) {
      return (
        <ActiveVotingProgress
          votedForMantissa={forVotesMantissa}
          votedAgainstMantissa={againstVotesMantissa}
          abstainedMantissa={abstainedVotesMantissa}
          votedTotalMantissa={votedTotalMantissa}
          xvs={xvs}
        />
      );
    }

    const totalPayloadsCount = 1 + remoteProposals.length; // BSC proposal + remote proposals
    const executedPayloadsCount =
      (state === ProposalState.Executed ? 1 : 0) +
      remoteProposals.filter(
        remoteProposal => remoteProposal.state === RemoteProposalState.Executed,
      ).length;

    return (
      <Status
        state={state}
        totalPayloadsCount={totalPayloadsCount}
        executedPayloadsCount={executedPayloadsCount}
      />
    );
  }, [
    state,
    remoteProposals,
    forVotesMantissa,
    againstVotesMantissa,
    abstainedVotesMantissa,
    votedTotalMantissa,
    xvs,
  ]);

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
      title={description.title}
      contentRightItem={contentRightItemDom}
      footer={
        statusDate && statusKey ? (
          <div css={styles.timestamp}>
            <Typography variant="small2">
              {state === ProposalState.Active && (
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

const GovernanceProposal: React.FC<Omit<GovernanceProposalProps, 'xvs' | 'isUserConnected'>> =
  props => {
    const { accountAddress } = useAccountAddress();

    const xvs = useGetToken({
      symbol: 'XVS',
    });

    return <GovernanceProposalUi xvs={xvs} isUserConnected={!!accountAddress} {...props} />;
  };

export default GovernanceProposal;
