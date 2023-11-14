/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import { Button, NoticeInfo, Spinner } from 'components';
import { useGetToken, useGetTokens } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProposalState, Proposal as ProposalType, Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useGetCurrentVotes, useGetProposal, useGetVoteReceipt } from 'clients/api';
import { governanceChain } from 'clients/web3';
import { useAuth } from 'context/AuthContext';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useVote, { UseVoteParams } from 'hooks/useVote';

import { Description } from './Description';
import ProposalSummary from './ProposalSummary';
import VoteModal from './VoteModal';
import VoteSummary from './VoteSummary';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalUiProps {
  tokens: Token[];
  proposal: ProposalType | undefined;
  vote: (params: UseVoteParams) => Promise<unknown>;
  votingEnabled: boolean;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  tokens,
  proposal,
  vote,
  votingEnabled,
  readableVoteWeight,
  isVoteLoading,
}) => {
  const { switchChain } = useAuth();
  const voteProposalFeatureEnabled = useIsFeatureEnabled({ name: 'voteProposal' });
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
    <div css={styles.root}>
      <ProposalSummary css={styles.summary} proposal={proposal} />

      {!voteProposalFeatureEnabled && (
        <NoticeInfo
          className="mb-8 w-full"
          data-testid={TEST_IDS.votingDisabledWarning}
          title={t('vote.multichain.votingOnlyEnabledOnBsc')}
          description={
            <Button
              className="h-auto"
              variant="text"
              onClick={() => switchChain({ chainId: governanceChain.id })}
            >
              {t('vote.multichain.switchToBsc')}
            </Button>
          }
        />
      )}

      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueMantissa={proposal.forVotesMantissa}
          votedTotalMantissa={proposal.totalVotesMantissa}
          voters={proposal.forVotes}
          openVoteModal={() => setVoteModalType(1)}
          progressBarColor={styles.successColor}
          votingEnabled={votingEnabled && voteProposalFeatureEnabled}
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
          votingEnabled={votingEnabled && voteProposalFeatureEnabled}
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
          votingEnabled={votingEnabled && voteProposalFeatureEnabled}
          testId={TEST_IDS.voteSummary.abstain}
        />
      </div>

      <Description
        description={proposal.description}
        actions={proposal.proposalActions}
        tokens={tokens}
      />

      {voteProposalFeatureEnabled && voteModalType !== undefined && (
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
  const { accountAddress } = useAuth();
  const { proposalId = '' } = useParams<{ proposalId: string }>();
  const { data: proposal } = useGetProposal(
    { proposalId, accountAddress },
    { enabled: !!proposalId },
  );
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const tokens = useGetTokens();

  const {
    data: votingWeightData = {
      votesWei: new BigNumber(0),
    },
  } = useGetCurrentVotes({ accountAddress: accountAddress || '' }, { enabled: !!accountAddress });

  const readableVoteWeight = useMemo(
    () =>
      convertWeiToTokens({
        value: votingWeightData.votesWei,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightData?.votesWei, xvs],
  );

  const { vote, isLoading } = useVote();
  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId: parseInt(proposalId, 10), accountAddress: accountAddress || '' },
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
    votingWeightData.votesWei.isGreaterThan(0);

  return (
    <ProposalUi
      tokens={tokens}
      proposal={proposal}
      vote={vote}
      votingEnabled={votingEnabled}
      readableVoteWeight={readableVoteWeight}
      isVoteLoading={isLoading}
    />
  );
};

export default Proposal;
