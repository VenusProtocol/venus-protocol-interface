import { chains } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';

import { PROPOSAL_EXECUTION_GRACE_PERIOD_MS } from 'constants/governance';
import { governanceChainId } from 'libs/wallet';
import {
  type AbstainVoter,
  type AgainstVoter,
  type ForVoter,
  type Proposal,
  ProposalState,
  VoteSupport,
} from 'types';
import {
  areAddressesEqual,
  compareBigNumbers,
  convertToDate,
  formatToProposalDescription,
  getProposalState,
} from 'utilities';
import type { ApiGovernanceTransaction, ApiProposal } from '../types';
import { formatToProposalActions } from './formatToProposalActions';
import { formatToRemoteProposal } from './formatToRemoteProposal';
import { getEstimatedDateByBlockHeight } from './getEstimatedDateByBlockHeight';

const { hardforks = [] } = chains[governanceChainId] ?? {};

const getTransactionDate = (transaction: ApiGovernanceTransaction | null) =>
  transaction ? convertToDate({ timestampSeconds: transaction.timestamp }) : undefined;

export const formatToProposal = ({
  apiProposal,
  currentBlockNumber,
  proposalMinQuorumVotesMantissa,
  accountAddress,
}: {
  apiProposal: ApiProposal;
  currentBlockNumber: number;
  proposalMinQuorumVotesMantissa: BigNumber;
  accountAddress?: string;
}) => {
  const { proposalId, startBlock, endBlock, executionEta, created, queued, canceled, executed } =
    apiProposal;

  const executionEtaDate = executionEta
    ? convertToDate({ timestampSeconds: executionEta })
    : undefined;

  const startDate = getEstimatedDateByBlockHeight({
    targetBlockHeight: startBlock,
    currentBlockHeight: currentBlockNumber,
    hardforks,
  });
  const endDate = getEstimatedDateByBlockHeight({
    targetBlockHeight: endBlock,
    currentBlockHeight: currentBlockNumber,
    hardforks,
  });

  const forVotes: ForVoter[] = [];
  const againstVotes: AgainstVoter[] = [];
  const abstainVotes: AbstainVoter[] = [];
  let userVoteSupport: VoteSupport | undefined;

  [...apiProposal.votes]
    .sort((a, b) =>
      compareBigNumbers(new BigNumber(a.votesMantissa), new BigNumber(b.votesMantissa), 'desc'),
    )
    .forEach(({ voterAddress, support, votesMantissa, reason }) => {
      const vote = {
        proposalId,
        address: voterAddress,
        reason: reason || undefined,
        votesMantissa: new BigNumber(votesMantissa),
      };

      if (support === VoteSupport.For) {
        forVotes.push({ ...vote, support });
      } else if (support === VoteSupport.Against) {
        againstVotes.push({ ...vote, support });
      } else {
        abstainVotes.push({ ...vote, support: VoteSupport.Abstain });
      }

      if (!!accountAddress && areAddressesEqual(accountAddress, voterAddress)) {
        userVoteSupport = support;
      }
    });

  const forVotesMantissa = new BigNumber(apiProposal.forVotesMantissa);
  const againstVotesMantissa = new BigNumber(apiProposal.againstVotesMantissa);
  const abstainedVotesMantissa = new BigNumber(apiProposal.abstainVotesMantissa);

  const state = getProposalState({
    startBlockNumber: startBlock,
    endBlockNumber: endBlock,
    currentBlockNumber,
    proposalMinQuorumVotesMantissa,
    forVotesMantissa,
    passing: apiProposal.passing,
    queued: !!queued,
    executed: !!executed,
    canceled: !!canceled,
    executionEtaTimestampMs: executionEta ? executionEta * 1000 : undefined,
  });

  const cancelDate = getTransactionDate(canceled);

  const expiredDate =
    state === ProposalState.Expired && executionEtaDate
      ? new Date(executionEtaDate.getTime() + PROPOSAL_EXECUTION_GRACE_PERIOD_MS)
      : undefined;

  const result: Proposal = {
    proposalId,
    proposalType: apiProposal.proposalType,
    proposerAddress: apiProposal.proposerAddress,
    state,
    description: formatToProposalDescription({
      description: apiProposal.description,
    }),
    endBlock,
    createdDate: getTransactionDate(created),
    cancelDate,
    queuedDate: getTransactionDate(queued),
    executedDate: getTransactionDate(executed),
    expiredDate,
    proposalActions: formatToProposalActions({ actions: apiProposal.actions }),
    forVotes,
    againstVotes,
    abstainVotes,
    abstainedVotesMantissa,
    againstVotesMantissa,
    forVotesMantissa,
    totalVotesMantissa: forVotesMantissa.plus(againstVotesMantissa).plus(abstainedVotesMantissa),
    userVoteSupport,
    createdTxHash: created?.txHash,
    cancelTxHash: canceled?.txHash,
    executedTxHash: executed?.txHash,
    queuedTxHash: queued?.txHash,
    startDate,
    endDate,
    executionEtaDate,
    remoteProposals: apiProposal.remoteProposals.map(apiRemoteProposal =>
      formatToRemoteProposal({
        proposalId,
        proposalState: state,
        proposalCanceledDate: cancelDate,
        proposalExpiredDate: expiredDate,
        proposalEndDate: endDate,
        apiRemoteProposal,
      }),
    ),
  };

  return result;
};
