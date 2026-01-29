/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import {
  type CastVoteInput,
  useGetCurrentVotes,
  useGetProposal,
  useGetProposalThreshold,
  useGetVoteReceipt,
  useVote,
} from 'clients/api';
import { Button, NoticeInfo, Page, Spinner } from 'components';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import {
  governanceChainId,
  useAccountAddress,
  useAccountChainId,
  useSwitchChain,
} from 'libs/wallet';
import { ProposalState, type Proposal as ProposalType } from 'types';
import { convertMantissaToTokens } from 'utilities';

import config from 'config';
import { NULL_ADDRESS } from 'constants/address';
import { Redirect } from 'containers/Redirect';
import { Commands } from './Commands';
import { Description } from './Description';
import ProposalSummary from './ProposalSummary';
import VoteModal from './VoteModal';
import VoteSummary from './VoteSummary';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalUiProps {
  proposal: ProposalType | undefined;
  vote: (params: CastVoteInput) => Promise<unknown>;
  canUserVoteOnProposal: boolean;
  isUserConnectedToGovernanceChain: boolean;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  proposal,
  vote,
  canUserVoteOnProposal,
  isUserConnectedToGovernanceChain,
  readableVoteWeight,
  isVoteLoading,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  useGetProposalThreshold();

  const { switchChain } = useSwitchChain();
  const [voteModalType, setVoteModalType] = useState<0 | 1 | 2 | undefined>(undefined);

  const isVoteProposalFeatureEnabled = useIsFeatureEnabled({ name: 'voteProposal' });

  const shouldShowWarning =
    canUserVoteOnProposal && (!isVoteProposalFeatureEnabled || !isUserConnectedToGovernanceChain);
  const shouldEnableVoteButtons =
    canUserVoteOnProposal && isVoteProposalFeatureEnabled && isUserConnectedToGovernanceChain;

  if (!proposal) {
    return (
      <div css={[styles.root, styles.spinner]}>
        <Spinner />
      </div>
    );
  }

  return (
    <div css={styles.root} className="space-y-6">
      <ProposalSummary proposal={proposal} />

      {shouldShowWarning && (
        <NoticeInfo
          className="w-full"
          data-testid={TEST_IDS.votingDisabledWarning}
          title={t('vote.omnichain.votingOnlyEnabledOnBnb')}
          description={
            config.isSafeApp ? undefined : (
              <Button
                className="h-auto"
                variant="text"
                onClick={() => switchChain({ chainId: governanceChainId })}
              >
                {t('vote.omnichain.switchToBnb')}
              </Button>
            )
          }
        />
      )}

      <div className="space-y-6 xl:space-y-0 xl:flex xl:space-x-6">
        <VoteSummary
          label={t('vote.for')}
          votedValueMantissa={proposal.forVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.forVotes}
          openVoteModal={() => setVoteModalType(1)}
          progressBarColor={styles.successColor}
          votingEnabled={shouldEnableVoteButtons}
          data-testid={TEST_IDS.voteSummary.for}
        />

        <VoteSummary
          label={t('vote.against')}
          votedValueMantissa={proposal.againstVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.againstVotes}
          openVoteModal={() => setVoteModalType(0)}
          progressBarColor={styles.againstColor}
          votingEnabled={shouldEnableVoteButtons}
          data-testid={TEST_IDS.voteSummary.against}
        />

        <VoteSummary
          label={t('vote.abstain')}
          votedValueMantissa={proposal.abstainedVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.abstainVotes}
          openVoteModal={() => setVoteModalType(2)}
          progressBarColor={styles.abstainColor}
          votingEnabled={shouldEnableVoteButtons}
          data-testid={TEST_IDS.voteSummary.abstain}
        />
      </div>

      <Description description={proposal.description} />

      <Commands proposal={proposal} />

      {isVoteProposalFeatureEnabled && voteModalType !== undefined && (
        <VoteModal
          voteModalType={voteModalType}
          handleClose={() => setVoteModalType(undefined)}
          vote={async (voteReason?: string) =>
            vote({ proposalId: proposal.proposalId, voteType: voteModalType, voteReason })
          }
          readableVoteWeight={readableVoteWeight}
          isVoteLoading={isVoteLoading}
        />
      )}
    </div>
  );
};

const Proposal = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId: accountChainId } = useAccountChainId();
  const { proposalId = '' } = useParams<{ proposalId: string }>();
  const { data: proposalData, error: getProposalError } = useGetProposal(
    { proposalId: Number(proposalId), accountAddress },
    { enabled: !!proposalId },
  );
  const proposal = proposalData?.proposal;

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: votingWeightData = {
      votesMantissa: new BigNumber(0),
    },
  } = useGetCurrentVotes(
    { accountAddress: accountAddress || NULL_ADDRESS },
    { enabled: !!accountAddress },
  );

  const readableVoteWeight = useMemo(
    () =>
      convertMantissaToTokens({
        value: votingWeightData.votesMantissa,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightData?.votesMantissa, xvs],
  );

  const { mutateAsync: vote, isPending } = useVote();
  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId: Number(proposalId), accountAddress: accountAddress || NULL_ADDRESS },
    { enabled: !!accountAddress },
  );

  // voting should be enabled if:
  const canUserVoteOnProposal =
    // user wallet is connected
    !!accountAddress &&
    // proposal is still active
    proposal?.state === ProposalState.Active &&
    // user has not voted yet
    userVoteReceipt?.voteSupport === undefined &&
    // user has some voting weight
    votingWeightData.votesMantissa.isGreaterThan(0);

  const isUserConnectedToGovernanceChain = accountChainId === governanceChainId;

  if (getProposalError) {
    return <Redirect to={routes.governance.path} />;
  }

  return (
    <Page>
      <ProposalUi
        proposal={proposal}
        vote={vote}
        canUserVoteOnProposal={canUserVoteOnProposal}
        isUserConnectedToGovernanceChain={isUserConnectedToGovernanceChain}
        readableVoteWeight={readableVoteWeight}
        isVoteLoading={isPending}
      />
    </Page>
  );
};

export default Proposal;
