import type { Proposal, ProposalState, ProposalType, VoteSupport } from 'types';

export interface GetProposalsInput {
  limit?: number;
  page?: number;
  accountAddress: string | undefined;
}

export interface GetProposalInput {
  proposalId: number | string;
  accountAddress: string | undefined;
}

export interface ProposalsApiResponse {
  page: number;
  result: ProposalApiResponse[];
  limit: number;
  total: number;
}

export interface GetProposalsOutput {
  page: number;
  proposals: Proposal[];
  limit: number;
  total: number;
}

export interface ProposalActionApiResponse {
  actionIndex: number;
  calldata: string;
  signature: string;
  target: string;
  value: string | null;
}

type VoterApiResponse = {
  proposalId: number;
  address: string;
  blockNumber: number;
  blockTimestamp: number;
  reason: string | undefined;
  votesMantissa: string;
  support: VoteSupport;
};

export interface ProposalApiResponse {
  abstainedVotesMantissa: string;
  againstVotesMantissa: string;
  cancelBlock: number | null;
  cancelTimestamp: number | null;
  cancelTxHash: string | null;
  createdBlock: number | null;
  createdTimestamp: number | null;
  createdTxHash: string | null;
  description: string;
  endBlock: number;
  endTimestamp: number;
  eta: number | null;
  executedBlock: number | null;
  executedTimestamp: number | null;
  executedTxHash: string | null;
  forVotesMantissa: string;
  governorName: string;
  proposer: string;
  queuedBlock: number | null;
  queuedTimestamp: number | null;
  queuedTxHash: string | null;
  startBlock: number;
  startTimestamp: number;
  state: ProposalState;
  proposalType: ProposalType;
  proposalId: number;
  proposalActions: ProposalActionApiResponse[] | undefined;
  votes: VoterApiResponse[] | undefined;
}

export type GetProposalOutput = Proposal;
