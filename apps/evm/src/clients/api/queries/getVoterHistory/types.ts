import type { VoteSupport } from 'types';

import type { ProposalApiResponse } from '../getProposals/types';

export type GetVoterHistoryResponse = {
  limit: number;
  page: number;
  total: number;
  result: Array<
    ProposalApiResponse & {
      votes: {
        address: string;
        support: VoteSupport;
        reason: string | null;
        votesMantissa: string;
      }[];
    }
  >;
};
