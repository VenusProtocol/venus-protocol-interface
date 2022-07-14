import address from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import castVote from './castVote';

describe('api/mutation/castVote', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        castVote: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await castVote({
        governorBravoContract: fakeContract,
        fromAccountAddress: address,
        proposalId: 1,
        voteType: 1,
      });

      throw new Error('castVote should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeTransaction = { events: {} };
    const sendMock = jest.fn(async () => fakeTransaction);
    const castVoteMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        castVote: castVoteMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await castVote({
      governorBravoContract: fakeContract,
      fromAccountAddress: address,
      proposalId: 1,
      voteType: 1,
    });

    expect(response).toBe(fakeTransaction);
    expect(castVoteMock).toHaveBeenCalledTimes(1);
    expect(castVoteMock).toHaveBeenCalledWith(1, 1);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
