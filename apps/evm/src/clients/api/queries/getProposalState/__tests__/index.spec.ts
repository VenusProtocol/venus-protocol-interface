import fakeAddress from '__mocks__/models/address';
import type { PublicClient } from 'viem';

import { getProposalState } from '..';

describe('getProposalState', () => {
  test('returns state of proposal', async () => {
    const fakeState = 1;

    const fakePublicClient = {
      readContract: async () => fakeState,
    } as unknown as PublicClient;

    const response = await getProposalState({
      publicClient: fakePublicClient,
      proposalId: 1,
      governorBravoDelegateAddress: fakeAddress,
    });

    expect(response).toEqual({
      state: fakeState,
    });
  });
});
