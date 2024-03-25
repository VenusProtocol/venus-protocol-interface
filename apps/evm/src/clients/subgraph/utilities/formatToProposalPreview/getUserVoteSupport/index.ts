import { type Proposal, Support } from 'clients/subgraph';
import { VoteSupport } from 'types';

export interface GetUserVoteSupportInput {
  voteSupport: Proposal['votes'][number]['support'];
}

export const getUserVoteSupport = ({ voteSupport }: GetUserVoteSupportInput) => {
  if (voteSupport === Support.For) {
    return VoteSupport.For;
  }

  if (voteSupport === Support.Against) {
    return VoteSupport.Against;
  }

  return VoteSupport.Abstain;
};
