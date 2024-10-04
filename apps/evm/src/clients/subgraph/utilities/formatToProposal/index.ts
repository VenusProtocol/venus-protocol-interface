import BigNumber from 'bignumber.js';
import type { BscProposalFragment } from 'clients/subgraph/gql/generated/governanceBsc';
import type { NonBscProposalFragment } from 'clients/subgraph/gql/generated/governanceNonBsc';
import { CHAIN_METADATA, PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/chainMetadata';
import { governanceChain } from 'libs/wallet';
import {
  type AbstainVoter,
  type AgainstVoter,
  type ForVoter,
  type Proposal,
  ProposalState,
  type RemoteProposal,
  VoteSupport,
} from 'types';
import {
  areAddressesEqual,
  compareBigNumbers,
  convertToDate,
  formatToProposalDescription,
  getProposalState,
  getProposalType,
  getUserVoteSupport,
} from 'utilities';
import { formatToProposalActions } from './formatToProposalActions';
import { formatToRemoteProposal } from './formatToRemoteProposal';

const { blockTimeMs: BSC_BLOCK_TIME_MS } = CHAIN_METADATA[governanceChain.id];

export const formatToProposal = ({
  gqlProposal,
  gqlRemoteProposalsMapping,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  accountAddress,
}: {
  gqlProposal: BscProposalFragment;
  gqlRemoteProposalsMapping: {
    [proposalId: number]: NonBscProposalFragment;
  };
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  accountAddress?: string;
}) => {
  const executionEtaDate = convertToDate({
    timestampSeconds: Number(gqlProposal.executionEta),
  });

  const nowMs = new Date().getTime();
  const startDate = new Date(
    nowMs + (Number(gqlProposal.startBlock) - currentBlockNumber) * BSC_BLOCK_TIME_MS!,
  );
  const endDate = new Date(
    nowMs + (Number(gqlProposal.endBlock) - currentBlockNumber) * BSC_BLOCK_TIME_MS!,
  );

  // Extract votes
  const {
    forVotes,
    againstVotes,
    abstainVotes,
    totalVotesMantissa,
    abstainedVotesMantissa,
    againstVotesMantissa,
    forVotesMantissa,
    userVoteSupport,
  } = [...gqlProposal.votes]
    .sort((a, b) => compareBigNumbers(new BigNumber(a.votes), new BigNumber(b.votes), 'desc'))
    .reduce<{
      forVotes: ForVoter[];
      againstVotes: AgainstVoter[];
      abstainVotes: AbstainVoter[];
      totalVotesMantissa: BigNumber;
      abstainedVotesMantissa: BigNumber;
      againstVotesMantissa: BigNumber;
      forVotesMantissa: BigNumber;
      userVoteSupport?: VoteSupport;
    }>(
      (acc, gqlVote) => {
        const accCopy = { ...acc };

        const vote = {
          proposalId: gqlProposal.proposalId,
          address: gqlVote.voter.id,
          reason: gqlVote.reason ?? undefined,
          support: getUserVoteSupport({ voteSupport: gqlVote.support }),
          votesMantissa: new BigNumber(gqlVote.votes),
        };

        accCopy.totalVotesMantissa = accCopy.totalVotesMantissa.plus(vote.votesMantissa);

        if (vote.support === VoteSupport.For) {
          accCopy.forVotes.push(vote as ForVoter);
          accCopy.forVotesMantissa = accCopy.forVotesMantissa.plus(vote.votesMantissa);
        } else if (vote.support === VoteSupport.Against) {
          accCopy.againstVotes.push(vote as AgainstVoter);
          accCopy.againstVotesMantissa = accCopy.againstVotesMantissa.plus(vote.votesMantissa);
        } else {
          accCopy.abstainVotes.push(vote as AbstainVoter);
          accCopy.abstainedVotesMantissa = accCopy.abstainedVotesMantissa.plus(vote.votesMantissa);
        }

        if (!!accountAddress && areAddressesEqual(accountAddress, vote.address)) {
          accCopy.userVoteSupport = vote.support;
        }

        return accCopy;
      },
      {
        forVotes: [],
        againstVotes: [],
        abstainVotes: [],
        totalVotesMantissa: new BigNumber(0),
        abstainedVotesMantissa: new BigNumber(0),
        againstVotesMantissa: new BigNumber(0),
        forVotesMantissa: new BigNumber(0),
        userVoteSupport: undefined,
      },
    );

  const state = getProposalState({
    startBlockNumber: Number(gqlProposal.startBlock),
    endBlockNumber: Number(gqlProposal.endBlock),
    currentBlockNumber,
    proposalMinQuorumVotesMantissa,
    forVotesMantissa,
    passing: gqlProposal.passing,
    queued: !!gqlProposal.queued?.timestamp,
    executed: !!gqlProposal.executed?.timestamp,
    canceled: !!gqlProposal.canceled?.timestamp,
    executionEtaTimestampMs: Number(gqlProposal.executionEta * 1000),
  });

  // Extract BSC proposal actions
  const proposalActions = formatToProposalActions({
    callDatas: gqlProposal.calldatas || [],
    signatures: gqlProposal.signatures || [],
    targets: gqlProposal.targets || [],
    values: gqlProposal.values || [],
  });

  const cancelDate = gqlProposal.canceled?.timestamp
    ? convertToDate({
        timestampSeconds: Number(gqlProposal.canceled.timestamp),
      })
    : undefined;

  const queuedDate = gqlProposal.queued?.timestamp
    ? convertToDate({
        timestampSeconds: Number(gqlProposal.queued.timestamp),
      })
    : undefined;

  const executedDate = gqlProposal.executed?.timestamp
    ? convertToDate({
        timestampSeconds: Number(gqlProposal.executed.timestamp),
      })
    : undefined;

  const expiredDate =
    state === ProposalState.Expired && executionEtaDate
      ? new Date(executionEtaDate.getTime() + PROPOSAL_EXECUTION_GRACE_PERIOD_MS)
      : undefined;

  const remoteProposals = gqlProposal.remoteProposals.reduce<RemoteProposal[]>(
    (
      acc,
      { proposalId, trustedRemote, stateTransactions, calldatas, signatures, targets, values },
    ) => {
      const gqlRemoteProposal = gqlRemoteProposalsMapping[proposalId];

      const remoteProposal = formatToRemoteProposal({
        proposalState: state,
        proposalCanceledDate: cancelDate,
        proposalExpiredDate: expiredDate,
        proposalEndDate: endDate,
        remoteProposalId: Number(gqlProposal.proposalId),
        layerZeroChainId: trustedRemote.layerZeroChainId,
        gqlRemoteProposal,
        failedTimestampSeconds: stateTransactions?.stored?.timestamp
          ? Number(stateTransactions.stored.timestamp)
          : undefined,
        bridgedTimestampSeconds: stateTransactions?.executed?.timestamp
          ? Number(stateTransactions.executed.timestamp)
          : undefined,
        withdrawnTimestampSeconds: stateTransactions?.withdrawn?.timestamp
          ? Number(stateTransactions.withdrawn.timestamp)
          : undefined,
        callDatas: calldatas ?? [],
        signatures: signatures ?? [],
        targets: targets ?? [],
        values: values ?? [],
      });

      return [...acc, remoteProposal];
    },
    [],
  );

  const result: Proposal = {
    proposalId: Number(gqlProposal.proposalId),
    proposalType: getProposalType({ type: gqlProposal.type }),
    proposerAddress: gqlProposal.proposer.id,
    state,
    description: formatToProposalDescription({
      description: gqlProposal.description,
    }),
    endBlock: +gqlProposal.endBlock,
    createdDate: gqlProposal.created?.timestamp
      ? convertToDate({
          timestampSeconds: Number(gqlProposal.created.timestamp),
        })
      : undefined,
    cancelDate,
    queuedDate,
    executedDate,
    expiredDate,
    proposalActions,
    forVotes,
    againstVotes,
    abstainVotes,
    abstainedVotesMantissa,
    againstVotesMantissa,
    forVotesMantissa,
    totalVotesMantissa,
    userVoteSupport,
    createdTxHash: gqlProposal.created?.txHash,
    cancelTxHash: gqlProposal.canceled?.txHash,
    executedTxHash: gqlProposal.executed?.txHash,
    queuedTxHash: gqlProposal.queued?.txHash,
    startDate,
    endDate,
    executionEtaDate,
    remoteProposals,
  };

  return result;
};
