import { IProposalApiResponse } from '../getProposals';

export interface IGetVoterHistoryResponse {
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
    proposal: Omit<IProposalApiResponse, 'actions' | 'blockNumber'>;
    proposalId: number;
    reason: null | string;
    support: 0 | 1 | 2;
    updatedAt: string;
    votes: string;
  }[];
}
