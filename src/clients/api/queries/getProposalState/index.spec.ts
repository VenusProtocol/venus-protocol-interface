import { ContractTypeByName } from 'packages/contracts';

import getProposalState from '.';

describe('api/queries/getProposalState', () => {
  test('returns state of proposal', async () => {
    const fakeState = 1;

    const fakeContract = {
      state: async () => fakeState,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await getProposalState({
      governorBravoDelegateContract: fakeContract,
      proposalId: '1',
    });
    expect(response).toEqual({
      state: fakeState,
    });
  });
});
