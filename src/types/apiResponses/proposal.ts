import { ProposalState } from 'types';

export interface IProposalAction {
  data: string;
  signature: string;
  target: string;
  title: string;
  value: string;
}

export interface IProposalApiResponse {
  abstainedVotes: string;
  actions: IProposalAction[];
  againstVotes: string;
  blockNumber: number;
  calldatas: string[];
  cancelBlock: number | null;
  cancelTimestamp: number | null;
  cancelTxHash: string | null;
  canceled: boolean;
  createdAt: string;
  createdBlock: number;
  createdTimestamp: number;
  createdTxHash: string;
  description: string;
  endBlock: number;
  endTimestamp: number;
  endTxHash: string | null;
  eta: number;
  executed: boolean;
  executedBlock: number;
  executedTimestamp: number;
  executedTxHash: string;
  forVotes: string;
  governorName: string;
  id: number;
  proposer: string;
  queuedBlock: number;
  queuedTimestamp: number;
  queuedTxHash: string;
  signatures: string[];
  startBlock: number;
  startTimestamp: number;
  startTxHash: string | null;
  state: ProposalState;
  // JSON
  targets: string[];
  updatedAt: string;
  values: string[];
  voterCount: number | null;
}
