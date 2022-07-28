import { VotersDetails } from 'types';

export interface GetVotersInput {
  id: string | number;
  // 0 - "for" votes, 1 – "against" votes, 2 – "abstain" votes
  filter?: 0 | 1 | 2;
  limit?: number;
  offset?: number;
}

export interface VoterResult {
  address: string;
  blockNumber: number;
  blockTimestamp: number;
  createdAt: string;
  hasVoted: boolean;
  id: string;
  proposalId: number;
  reason: string | null;
  support: 0 | 1 | 2;
  updatedAt: string;
  votes: string;
  votes2: string;
}

export interface GetVotersApiResponse {
  limit: number;
  result: VoterResult[];
  sumVotes: { for: string; against: string; abstain: string; total: string };
  total: number;
}

export type GetVotersOutput = VotersDetails;
