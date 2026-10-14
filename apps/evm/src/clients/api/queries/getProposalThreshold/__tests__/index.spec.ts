import fakeAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import { ProposalType } from 'types';
import { getProposalThreshold } from '..';

describe('getProposalThreshold', () => {
  test('returns the threshold configured for the passed proposal type', async () => {
    const fakeThreshold = 1000000000000000000000000n;
    const readContract = vi.fn(async () => [1n, 192384n, fakeThreshold]);

    const fakePublicClient = {
      readContract,
    } as unknown as PublicClient;

    const response = await getProposalThreshold({
      publicClient: fakePublicClient,
      governorBravoDelegateAddress: fakeAddress,
      proposalType: ProposalType.FAST_TRACK,
    });

    expect(readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'proposalConfigs',
        args: [BigInt(ProposalType.FAST_TRACK)],
      }),
    );

    expect(response).toEqual({
      thresholdMantissa: new BigNumber(fakeThreshold.toString()),
    });
  });
});
