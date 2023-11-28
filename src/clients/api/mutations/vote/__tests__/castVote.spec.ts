import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { GovernorBravoDelegate } from 'packages/contracts';

import castVote from '../castVote';

describe('castVote', () => {
  test('returns contract transaction when request succeeds', async () => {
    const castVoteMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      castVote: castVoteMock,
    } as unknown as GovernorBravoDelegate;

    const response = await castVote({
      governorBravoDelegateContract: fakeContract,
      proposalId: 1,
      voteType: 1,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(castVoteMock).toHaveBeenCalledTimes(1);
    expect(castVoteMock).toHaveBeenCalledWith(1, 1);
  });
});
