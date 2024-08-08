/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { commands as fakeCommands } from '__mocks__/models/proposalCommands';
import { useGetCurrentVotes, useGetProposal, useGetVoteReceipt } from 'clients/api';
import { Button, NoticeInfo, Redirect, Spinner } from 'components';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useVote, { type UseVoteParams } from 'hooks/useVote';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { governanceChain, useAccountAddress, useSwitchChain } from 'libs/wallet';
import { ProposalState, type Proposal as ProposalType } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { Commands } from './Commands';
import { Description } from './Description';
import ProposalSummary from './ProposalSummary';
import VoteModal from './VoteModal';
import VoteSummary from './VoteSummary';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalUiProps {
  proposal: ProposalType | undefined;
  vote: (params: UseVoteParams) => Promise<unknown>;
  votingEnabled: boolean;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  proposal,
  vote,
  votingEnabled,
  readableVoteWeight,
  isVoteLoading,
}) => {
  const { switchChain } = useSwitchChain();
  const isVoteProposalFeatureEnabled = useIsFeatureEnabled({ name: 'voteProposal' });
  const isMultichainGovernanceFeatureEnabled = useIsFeatureEnabled({
    name: 'multichainGovernance',
  });
  const styles = useStyles();
  const { t } = useTranslation();

  const [voteModalType, setVoteModalType] = useState<0 | 1 | 2 | undefined>(undefined);

  if (!proposal) {
    return (
      <div css={[styles.root, styles.spinner]}>
        <Spinner />
      </div>
    );
  }

  return (
    <div css={styles.root} className="space-y-6 xl:space-y-8">
      <ProposalSummary proposal={proposal} />

      {!isVoteProposalFeatureEnabled && (
        <NoticeInfo
          className="w-full"
          data-testid={TEST_IDS.votingDisabledWarning}
          title={t('vote.multichain.votingOnlyEnabledOnBnb')}
          description={
            <Button
              className="h-auto"
              variant="text"
              onClick={() => switchChain({ chainId: governanceChain.id })}
            >
              {t('vote.multichain.switchToBnb')}
            </Button>
          }
        />
      )}

      {isMultichainGovernanceFeatureEnabled && (
        <Commands
          commands={fakeCommands} // TODO: fetch (see VEN-2701)
        />
      )}

      <div css={styles.votes} className="space-y-6 lg:space-y-0">
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueMantissa={proposal.forVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.forVotes}
          openVoteModal={() => setVoteModalType(1)}
          progressBarColor={styles.successColor}
          votingEnabled={votingEnabled && isVoteProposalFeatureEnabled}
          testId={TEST_IDS.voteSummary.for}
        />

        <VoteSummary
          css={styles.vote}
          label={t('vote.against')}
          votedValueMantissa={proposal.againstVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.againstVotes}
          openVoteModal={() => setVoteModalType(0)}
          progressBarColor={styles.againstColor}
          votingEnabled={votingEnabled && isVoteProposalFeatureEnabled}
          testId={TEST_IDS.voteSummary.against}
        />

        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueMantissa={proposal.abstainedVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.abstainVotes}
          openVoteModal={() => setVoteModalType(2)}
          progressBarColor={styles.abstainColor}
          votingEnabled={votingEnabled && isVoteProposalFeatureEnabled}
          testId={TEST_IDS.voteSummary.abstain}
        />
      </div>

      <Description description={proposal.description} actions={proposal.proposalActions} />

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
  const { proposalId = '' } = useParams<{ proposalId: string }>();
  const { data: proposal, error: getProposalError } = useGetProposal(
    { proposalId, accountAddress },
    { enabled: !!proposalId },
  );

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: votingWeightData = {
      votesMantissa: new BigNumber(0),
    },
  } = useGetCurrentVotes({ accountAddress: accountAddress || '' }, { enabled: !!accountAddress });

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

  const { vote, isLoading } = useVote();
  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId: Number.parseInt(proposalId, 10), accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  // voting should be enabled if:
  const votingEnabled =
    // user wallet is connected
    !!accountAddress &&
    // proposal is still active
    proposal?.state === ProposalState.Active &&
    // user has not voted yet
    userVoteReceipt?.voteSupport === undefined &&
    // user has some voting weight
    votingWeightData.votesMantissa.isGreaterThan(0);

  if (getProposalError) {
    return <Redirect to={routes.governance.path} />;
  }

  return (
    <ProposalUi
      proposal={proposal}
      vote={vote}
      votingEnabled={votingEnabled}
      readableVoteWeight={readableVoteWeight}
      isVoteLoading={isLoading}
    />
  );
};

export default Proposal;
