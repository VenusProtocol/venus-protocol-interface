import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import executeProposal from '.';

describe('api/mutation/executeProposal', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        execute: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await executeProposal({
        governorBravoContract: fakeContract,
        accountAddress: '0x32asdf',
        proposalId: 3816,
      });

      throw new Error('executeProposal should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const executeProposalMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        execute: executeProposalMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await executeProposal({
      governorBravoContract: fakeContract,
      accountAddress: fakeAddress,
      proposalId: 3816,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(executeProposalMock).toHaveBeenCalledTimes(1);
    expect(executeProposalMock).toHaveBeenCalledWith(3816);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAddress });
  });
});
