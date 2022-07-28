import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import cancelProposal from '../cancelProposal';

describe('api/mutation/cancelProposal', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        cancel: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await cancelProposal({
        governorBravoContract: fakeContract,
        accountAddress: '0x32asdf',
        proposalId: 3816,
      });

      throw new Error('cancelProposal should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const cancelProposalMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        cancel: cancelProposalMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await cancelProposal({
      governorBravoContract: fakeContract,
      accountAddress: fakeAddress,
      proposalId: 3816,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(cancelProposalMock).toHaveBeenCalledTimes(1);
    expect(cancelProposalMock).toHaveBeenCalledWith(3816);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAddress });
  });
});
