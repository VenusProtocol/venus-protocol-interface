import { ProposalApiResponse } from '../getProposals';

export interface GetVoterHistoryResponse {
  limit: number;
  offset: number;
  total: number;
  result: {
    address: string;
    blockNumber: number;
    blockTimestamp: number;
    createdAt: string;
    hasVoted: boolean;
    id: string;
    proposal: Omit<ProposalApiResponse, 'actions' | 'blockNumber'>;
    proposalId: number;
    reason: null | string;
    support: 0 | 1 | 2;
    updatedAt: string;
    votes: string;
  }[];
}
