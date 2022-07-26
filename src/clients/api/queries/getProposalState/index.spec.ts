import { GovernorBravoDelegate } from 'types/contracts';

import getProposalState from '.';

describe('api/queries/getProposalState', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        state: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await getProposalState({
        governorBravoContract: fakeContract,
        proposalId: '1',
      });

      throw new Error('getProposalState should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns state of proposal', async () => {
    const fakeState = '1';

    const fakeContract = {
      methods: {
        state: () => ({
          call: async () => fakeState,
        }),
      },
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalState({
      governorBravoContract: fakeContract,
      proposalId: '1',
    });
    expect(response).toEqual({
      state: fakeState,
    });
  });
});
