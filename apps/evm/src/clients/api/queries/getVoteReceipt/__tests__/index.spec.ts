import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVoteReceipt } from '..';

describe('getVoteReceipt', () => {
  it('returns vote receipt in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => ({
        hasVoted: true,
        support: 1,
        votes: 1000000000000000000n,
      }),
    } as unknown as PublicClient;

    const res = await getVoteReceipt({
      publicClient: fakePublicClient,
      governorBravoDelegateAddress: fakeAddress,
      proposalId: 1,
      accountAddress: fakeAddress,
    });

    expect(res.voteSupport).toBe(1);
    expect(res).toMatchSnapshot();
  });

  it('returns undefined when no vote is cast', async () => {
    const fakePublicClient = {
      readContract: async () => ({
        hasVoted: false,
        support: 0,
        votes: 0n,
      }),
    } as unknown as PublicClient;

    const res = await getVoteReceipt({
      publicClient: fakePublicClient,
      governorBravoDelegateAddress: fakeAddress,
      proposalId: 1,
      accountAddress: fakeAddress,
    });

    expect(res.voteSupport).toBeUndefined();
    expect(res).toMatchSnapshot();
  });
});
