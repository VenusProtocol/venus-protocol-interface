import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import castVoteWithReason from '../castVoteWithReason';

describe('castVoteWithReason', () => {
  test('returns contract transaction when request succeeds', async () => {
    const castVoteWithReasonMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      castVoteWithReason: castVoteWithReasonMock,
    } as unknown as GovernorBravoDelegate;

    const response = castVoteWithReason({
      governorBravoDelegateContract: fakeContract,
      proposalId: 1,
      voteType: 1,
      voteReason: 'yes!',
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [1, 1, 'yes!'],
      methodName: 'castVoteWithReason',
    });
  });
});
