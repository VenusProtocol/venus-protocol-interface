import type BigNumber from 'bignumber.js';

export interface GetVoteSummaryInput {
  proposalId: number;
}

export interface GetVoteSummaryApiResponse {
  for: string;
  against: string;
  abstain: string;
  total: string;
}

export interface VoteSummary {
  for: BigNumber;
  against: BigNumber;
  abstain: BigNumber;
  total: BigNumber;
}

export type GetVoteSummaryOutput = VoteSummary;
