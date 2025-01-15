/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

import { ActiveVotingProgress, Countdown, ProposalTypeChip } from 'components';
import { routes } from 'constants/routing';
import { useIsProposalExecutable } from 'hooks/useIsProposalExecutable';
import { useTranslation } from 'libs/translations';
import { type Proposal, ProposalState, ProposalType, type Token, VoteSupport } from 'types';

import { ProposalCard } from 'containers/ProposalCard';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
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

  const isExecutable = useIsProposalExecutable({
    isQueued: state === ProposalState.Queued,
    executionEtaDate,
  });

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

  const [statusDate, statusKey] = useMemo(() => {
    switch (state) {
      case ProposalState.Active:
        return [endDate, 'voteProposalUi.activeUntilDate'];
      case ProposalState.Canceled:
        return [cancelDate, 'voteProposalUi.canceledDate'];
      case ProposalState.Executed:
        return [executedDate, 'voteProposalUi.executedDate'];
      case ProposalState.Queued:
        return isExecutable
          ? [undefined, undefined]
          : [executionEtaDate, 'voteProposalUi.queuedUntilDate'];
      case ProposalState.Defeated:
        return [endDate, 'voteProposalUi.defeatedDate'];
      case ProposalState.Expired:
        return [expiredDate, 'voteProposalUi.expiredDate'];
      default:
        return [undefined, undefined];
    }
  }, [state, cancelDate, executedDate, endDate, executionEtaDate, expiredDate, isExecutable]);

  const contentRightItemDom = useMemo(() => {
    if (state === ProposalState.Active) {
      return (
        <ActiveVotingProgress
          votedForMantissa={forVotesMantissa}
          votedAgainstMantissa={againstVotesMantissa}
          abstainedMantissa={abstainedVotesMantissa}
          xvs={xvs}
        />
      );
    }

    return (
      <Status state={state} remoteProposals={remoteProposals} executionEtaDate={executionEtaDate} />
    );
  }, [
    state,
    remoteProposals,
    forVotesMantissa,
    againstVotesMantissa,
    abstainedVotesMantissa,
    xvs,
    executionEtaDate,
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
