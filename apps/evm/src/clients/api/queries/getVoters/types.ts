import type { VoteSupport, VotersDetails } from 'types';

export interface GetVotersInput {
  proposalId?: number;
  address?: string;
  support?: VoteSupport;
  limit?: number;
  offset?: number;
}

export interface VoterResult {
  address: string;
  blockNumber: number;
  blockTimestamp: number;
  proposalId: number;
  reason: string | null;
  support: VoteSupport;
  votesMantissa: string;
}

export interface GetVotersApiResponse {
  limit: number;
  result: VoterResult[];
  total: number;
}

export type GetVotersOutput = VotersDetails;
