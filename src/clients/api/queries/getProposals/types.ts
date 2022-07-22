import { Proposal } from 'types';

export interface GetProposalsInput {
  limit?: number;
  page?: number;
}

export interface GetProposalInput {
  id: number | string;
}

export interface ProposalApiResponse {
  abstainedVotes: string;
  actions: {
    data: string;
    signature: string;
    target: string;
    title: string;
    value: string;
  }[];
  againstVotes: string;
  blockNumber: number;
  calldatas: string[];
  cancelBlock: number | null;
  cancelTimestamp: number | null;
  cancelTxHash: string | null;
  canceled: boolean;
  createdAt: string | null;
  createdBlock: number | null;
  createdTimestamp: number | null;
  createdTxHash: string | null;
  description: string;
  endBlock: number;
  endTimestamp: number;
  endTxHash: string | null;
  eta: number;
  executed: boolean;
  executedBlock: number | null;
  executedTimestamp: number | null;
  executedTxHash: string | null;
  forVotes: string;
  governorName: string;
  id: number;
  proposer: string;
  queuedBlock: number | null;
  queuedTimestamp: number | null;
  queuedTxHash: string | null;
  signatures: string[];
  startBlock: number;
  startTimestamp: number;
  startTxHash: string | null;
  state:
    | 'Pending'
    | 'Active'
    | 'Canceled'
    | 'Defeated'
    | 'Succeeded'
    | 'Queued'
    | 'Expired'
    | 'Executed';
  // JSON
  targets: string[];
  updatedAt: string;
  values: string[];
  voterCount: number | null;
}

export interface ProposalsApiResponse {
  offset: number;
  result: ProposalApiResponse[];
  limit: number;
  total: number;
}

export interface GetProposalsOutput {
  offset: number;
  proposals: Proposal[];
  limit: number;
  total: number;
}

export type GetProposalOutput = Proposal;
