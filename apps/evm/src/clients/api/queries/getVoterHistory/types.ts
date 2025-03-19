import type { ProposalState, ProposalType, VoteSupport } from 'types';
import type { Address, ByteArray, Hex } from 'viem';

export interface ProposalActionApiResponse {
  actionIndex: number;
  calldata: Hex | ByteArray;
  signature: string;
  target: Address;
  value: string | null;
}

type VoterApiResponse = {
  proposalId: number;
  address: Address;
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
  proposer: Address;
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

export type GetVoterHistoryResponse = {
  limit: number;
  page: number;
  total: number;
  result: Array<
    ProposalApiResponse & {
      votes: {
        address: Address;
        support: VoteSupport;
        reason: string | null;
        votesMantissa: string;
      }[];
    }
  >;
};
