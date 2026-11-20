import type { ProposalState, ProposalType, VoteSupport } from 'types';
import type { Address, Hex } from 'viem';

export interface ApiGovernanceTransaction {
  txHash: string;
  blockNumber: number;
  timestamp: number;
}

export interface ApiProposalAction {
  targetAddress: Address;
  valueMantissa: string;
  signature: string;
  calldata: Hex;
}

export interface ApiProposalVote {
  voterAddress: Address;
  support: VoteSupport;
  votesMantissa: string;
  reason: string | null;
  transaction: ApiGovernanceTransaction | null;
}

export interface ApiRemoteProposalExecution {
  chainId: number;
  executionEta: number | null;
  queued: ApiGovernanceTransaction | null;
  executed: ApiGovernanceTransaction | null;
  canceled: ApiGovernanceTransaction | null;
}

export interface ApiRemoteProposal {
  layerZeroChainId: number;
  remoteProposalId: number | null;
  actions: ApiProposalAction[];
  failedReason: string | null;
  stored: ApiGovernanceTransaction | null;
  bridged: ApiGovernanceTransaction | null;
  withdrawn: ApiGovernanceTransaction | null;
  execution: ApiRemoteProposalExecution | null;
}

export interface ApiProposal {
  proposalId: number;
  proposerAddress: Address;
  proposalType: ProposalType;
  description: string;
  state: ProposalState;
  startBlock: number;
  endBlock: number;
  executionEta: number | null;
  forVotesMantissa: string;
  againstVotesMantissa: string;
  abstainVotesMantissa: string;
  passing: boolean;
  created: ApiGovernanceTransaction | null;
  queued: ApiGovernanceTransaction | null;
  canceled: ApiGovernanceTransaction | null;
  executed: ApiGovernanceTransaction | null;
  actions: ApiProposalAction[];
  votes: ApiProposalVote[];
  remoteProposals: ApiRemoteProposal[];
}

export interface GetApiProposalsResponse {
  limit: number;
  page: number;
  total: number;
  result: ApiProposal[];
}
