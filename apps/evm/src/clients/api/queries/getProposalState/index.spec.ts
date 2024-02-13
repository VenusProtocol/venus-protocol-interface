import { GovernorBravoDelegate } from 'libs/contracts';

import getProposalState from '.';

describe('api/queries/getProposalState', () => {
  test('returns state of proposal', async () => {
    const fakeState = 1;

    const fakeContract = {
      state: async () => fakeState,
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalState({
      governorBravoDelegateContract: fakeContract,
      proposalId: '1',
    });
    expect(response).toEqual({
      state: fakeState,
    });
  });
});
