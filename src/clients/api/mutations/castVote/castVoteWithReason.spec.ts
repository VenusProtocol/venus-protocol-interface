import address from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';
import castVoteWithReason from './castVoteWithReason';

describe('api/mutation/castVoteWithReason', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        castVoteWithReason: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await castVoteWithReason({
        governorBravoContract: fakeContract,
        fromAccountAddress: address,
        proposalId: 1,
        voteType: 1,
        voteReason: '',
      });

      throw new Error('castVoteWithReason should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeTransaction = { events: {} };
    const sendMock = jest.fn(async () => fakeTransaction);
    const castVoteWithReasonMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        castVoteWithReason: castVoteWithReasonMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await castVoteWithReason({
      governorBravoContract: fakeContract,
      fromAccountAddress: address,
      proposalId: 1,
      voteType: 1,
      voteReason: 'yes!',
    });

    expect(response).toBe(fakeTransaction);
    expect(castVoteWithReasonMock).toHaveBeenCalledTimes(1);
    expect(castVoteWithReasonMock).toHaveBeenCalledWith(1, 1, 'yes!');
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
