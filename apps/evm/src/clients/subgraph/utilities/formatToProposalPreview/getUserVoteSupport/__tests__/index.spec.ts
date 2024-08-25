import { Support } from 'clients/subgraph';
import { VoteSupport } from 'types';
import { type GetUserVoteSupportInput, getUserVoteSupport } from '..';

describe('getUserVoteSupport', () => {
  const tests: { params: GetUserVoteSupportInput; expectedVoteSupport: VoteSupport }[] = [
    {
      params: {
        voteSupport: Support.For,
      },
      expectedVoteSupport: VoteSupport.For,
    },
    {
      params: {
        voteSupport: Support.Abstain,
      },
      expectedVoteSupport: VoteSupport.Abstain,
    },
    {
      params: {
        voteSupport: Support.Against,
      },
      expectedVoteSupport: VoteSupport.Against,
    },
  ];

  it.each(tests)(
    'returns the right vote support based on passed params: %s',
    async ({ params, expectedVoteSupport }) =>
      expect(getUserVoteSupport(params)).toBe(expectedVoteSupport),
  );
});
