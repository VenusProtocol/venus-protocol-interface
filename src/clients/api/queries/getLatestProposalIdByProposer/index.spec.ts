import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import getLatestProposalIdByProposer from '.';

describe('api/queries/getLatestProposalIdByProposer', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        latestProposalIds: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await getLatestProposalIdByProposer({
        governorBravoContract: fakeContract,
        accountAddress: fakeAddress,
      });

      throw new Error('getLatestProposalByIdProposer should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('with account return latest proposalId', async () => {
    const fakeContract = {
      methods: {
        latestProposalIds: () => ({
          call: async () => '1',
        }),
      },
    } as unknown as GovernorBravoDelegate;

    const response = await getLatestProposalIdByProposer({
      governorBravoContract: fakeContract,
      accountAddress: fakeAddress,
    });
    expect(response).toStrictEqual({
      proposalId: '1',
    });
  });
});
