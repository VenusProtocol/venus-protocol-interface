/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import { Spinner } from 'components';
import { ContractReceipt } from 'ethers';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Proposal as ProposalType, VotersDetails } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useGetCurrentVotes, useGetProposal, useGetVoteReceipt, useGetVoters } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useGetToken from 'hooks/useGetToken';
import useVote, { UseVoteParams } from 'hooks/useVote';

import { Description } from './Description';
import ProposalSummary from './ProposalSummary';
import VoteModal from './VoteModal';
import VoteSummary from './VoteSummary';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalUiProps {
  proposal: ProposalType | undefined;
  forVoters: VotersDetails;
  againstVoters: VotersDetails;
  abstainVoters: VotersDetails;
  vote: (params: UseVoteParams) => Promise<ContractReceipt>;
  votingEnabled: boolean;
  readableVoteWeight: string;
  isVoteLoading: boolean;
}

export const ProposalUi: React.FC<ProposalUiProps> = ({
  proposal,
  forVoters,
  againstVoters,
  abstainVoters,
  vote,
  votingEnabled,
  readableVoteWeight,
  isVoteLoading,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const [voteModalType, setVoteModalType] = useState<0 | 1 | 2 | undefined>(undefined);

  // Summing contract totals because there is a delay getting the totals from the server
  const totalVotesWei = useMemo(
    () =>
      forVoters.sumVotes.for.plus(
        againstVoters.sumVotes.against.plus(abstainVoters.sumVotes.abstain),
      ),
    [
      forVoters.sumVotes.for.toFixed(),
      againstVoters.sumVotes.against.toFixed(),
      abstainVoters.sumVotes.abstain.toFixed(),
    ],
  );

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

      <div css={styles.votes}>
        <VoteSummary
          css={styles.vote}
          label={t('vote.for')}
          votedValueWei={forVoters.sumVotes.for}
          votedTotalWei={totalVotesWei}
          voters={forVoters.result}
          openVoteModal={() => setVoteModalType(1)}
          progressBarColor={styles.successColor}
          votingEnabled={votingEnabled}
          testId={TEST_IDS.voteSummary.for}
        />

        <VoteSummary
          css={styles.vote}
          label={t('vote.against')}
          votedValueWei={againstVoters.sumVotes.against}
          votedTotalWei={totalVotesWei}
          voters={againstVoters.result}
          openVoteModal={() => setVoteModalType(0)}
          progressBarColor={styles.againstColor}
          votingEnabled={votingEnabled}
          testId={TEST_IDS.voteSummary.against}
        />

        <VoteSummary
          css={styles.vote}
          label={t('vote.abstain')}
          votedValueWei={abstainVoters.sumVotes.abstain}
          votedTotalWei={totalVotesWei}
          voters={abstainVoters.result}
          openVoteModal={() => setVoteModalType(2)}
          progressBarColor={styles.abstainColor}
          votingEnabled={votingEnabled}
          testId={TEST_IDS.voteSummary.abstain}
        />
      </div>

      <Description description={proposal.description} actions={proposal.actions} />

      {voteModalType !== undefined && (
        <VoteModal
          voteModalType={voteModalType}
          handleClose={() => setVoteModalType(undefined)}
          vote={async (voteReason?: string) =>
            vote({ proposalId: proposal.id, voteType: voteModalType, voteReason })
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
  const { data: proposal } = useGetProposal({ id: proposalId }, { enabled: !!proposalId });
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: votingWeightData = {
      votesWei: new BigNumber(0),
    },
  } = useGetCurrentVotes({ accountAddress: accountAddress || '' }, { enabled: !!accountAddress });

  const readableVoteWeight = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: votingWeightData.votesWei,
        token: xvs,
        returnInReadableFormat: true,
        addSymbol: false,
      }),
    [votingWeightData?.votesWei.toFixed(), xvs],
  );

  const defaultValue = {
    result: [],
    sumVotes: {
      for: new BigNumber(0),
      against: new BigNumber(0),
      abstain: new BigNumber(0),
      total: new BigNumber(0),
    },
  };
  const { data: againstVoters = defaultValue } = useGetVoters(
    { proposalId: parseInt(proposalId, 10), filter: 0 },
    { enabled: !!proposalId },
  );
  const { data: forVoters = defaultValue } = useGetVoters(
    { proposalId: parseInt(proposalId, 10), filter: 1 },
    { enabled: !!proposalId },
  );
  const { data: abstainVoters = defaultValue } = useGetVoters(
    { proposalId: parseInt(proposalId, 10), filter: 2 },
    { enabled: !!proposalId },
  );

  const { vote, isLoading } = useVote();
  const { data: userVoteReceipt } = useGetVoteReceipt(
    { proposalId: parseInt(proposalId, 10), accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const votingEnabled =
    !!accountAddress &&
    proposal?.state === 'Active' &&
    userVoteReceipt?.voteSupport === 'NOT_VOTED' &&
    votingWeightData.votesWei.isGreaterThan(0);

  return (
    <ProposalUi
      proposal={proposal}
      forVoters={forVoters}
      againstVoters={againstVoters}
      abstainVoters={abstainVoters}
      vote={vote}
      votingEnabled={votingEnabled}
      readableVoteWeight={readableVoteWeight}
      isVoteLoading={isLoading}
    />
  );
};

export default Proposal;
