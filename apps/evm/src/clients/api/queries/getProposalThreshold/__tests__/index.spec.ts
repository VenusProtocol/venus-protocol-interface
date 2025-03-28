import fakeAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import { getProposalThreshold } from '..';

describe('getProposalThreshold', () => {
  test('returns threshold of proposal', async () => {
    const fakeThreshold = 1000000000000000000000n;

    const fakePublicClient = {
      readContract: async () => fakeThreshold,
    } as unknown as PublicClient;

    const response = await getProposalThreshold({
      publicClient: fakePublicClient,
      governorBravoDelegateAddress: fakeAddress,
    });

    expect(response).toEqual({
      thresholdMantissa: new BigNumber(fakeThreshold.toString()),
    });
  });
});
