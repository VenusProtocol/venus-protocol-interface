import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import castVote from '../castVote';

describe('castVote', () => {
  test('returns contract transaction when request succeeds', async () => {
    const castVoteMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      castVote: castVoteMock,
    } as unknown as GovernorBravoDelegate;

    const response = castVote({
      governorBravoDelegateContract: fakeContract,
      proposalId: 1,
      voteType: 1,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [1, 1],
      methodName: 'castVote',
    });
  });
});
