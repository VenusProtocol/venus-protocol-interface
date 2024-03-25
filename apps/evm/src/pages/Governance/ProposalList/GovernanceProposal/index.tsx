/** @jsxImportSource @emotion/react */
import type { SerializedStyles } from '@emotion/react';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import {
  ActiveVotingProgress,
  Countdown,
  Icon,
  type IconName,
  ProposalCard,
  ProposalTypeChip,
} from 'components';
import { routes } from 'constants/routing';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type ProposalPreview, ProposalState, ProposalType, type Token, VoteSupport } from 'types';
import { getProposalStateLabel } from 'utilities/getProposalStateLabel';

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
  > = useMemo(() => {
    const label = state ? getProposalStateLabel({ state }) : t('proposalState.active');

    return {
      [ProposalState.Queued]: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label,
      },
      [ProposalState.Pending]: {
        iconWrapperCss: styles.iconDotsWrapper,
        iconName: 'dots',
        label,
      },
      [ProposalState.Executed]: {
        iconWrapperCss: styles.iconMarkWrapper,
        iconName: 'mark',
        iconCss: styles.iconCheck,
        label,
      },
      [ProposalState.Defeated]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label,
      },
      [ProposalState.Succeeded]: {
        iconWrapperCss: styles.iconInfoWrapper,
        iconName: 'exclamation',
        label,
      },
      [ProposalState.Expired]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label,
      },
      [ProposalState.Canceled]: {
        iconWrapperCss: styles.iconCloseWrapper,
        iconName: 'closeRounded',
        label,
      },
    };
  }, [
    t,
    styles.iconCheck,
    styles.iconCloseWrapper,
    styles.iconDotsWrapper,
    styles.iconInfoWrapper,
    styles.iconMarkWrapper,
    state,
  ]);

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

interface GovernanceProposalProps extends ProposalPreview {
  className?: string;
  isUserConnected: boolean;
  xvs?: Token;
}

const GovernanceProposalUi: React.FC<GovernanceProposalProps> = ({
  className,
  proposalId,
  description,
  state,
  executedDate,
  etaDate,
  cancelDate,
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
        return [cancelDate, 'voteProposalUi.cancelledDate'];
      case ProposalState.Executed:
        return [executedDate, 'voteProposalUi.executedDate'];
      case ProposalState.Queued:
        return [etaDate, 'voteProposalUi.queuedUntilDate'];
      case ProposalState.Defeated:
        return [endDate, 'voteProposalUi.defeatedDate'];
      default:
        return [undefined, undefined];
    }
  }, [state, cancelDate, executedDate, endDate, etaDate]);

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
      contentRightItem={
        state === ProposalState.Active ? (
          <ActiveVotingProgress
            votedForMantissa={forVotesMantissa}
            votedAgainstMantissa={againstVotesMantissa}
            abstainedMantissa={abstainedVotesMantissa}
            votedTotalMantissa={votedTotalMantissa}
            xvs={xvs}
          />
        ) : (
          <StatusCard state={state} />
        )
      }
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
