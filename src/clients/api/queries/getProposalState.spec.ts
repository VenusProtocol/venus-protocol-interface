import { GovernorBravoDelegate } from 'types/contracts';
import getProposalState from './getProposalState';

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

  test('returns state for proposal', async () => {
    const fakeContract = {
      methods: {
        state: () => ({
          call: async () => '1',
        }),
      },
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalState({
      governorBravoContract: fakeContract,
      proposalId: '1',
    });
    expect(response).toStrictEqual('1');
  });
});
