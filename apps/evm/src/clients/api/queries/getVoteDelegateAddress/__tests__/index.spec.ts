import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVoteDelegateAddress } from '..';

describe('getVoteDelegateAddress', () => {
  it('returns delegate address in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => fakeAddress,
    } as unknown as PublicClient;

    const res = await getVoteDelegateAddress({
      publicClient: fakePublicClient,
      xvsVaultAddress: fakeAddress,
      accountAddress: fakeAddress,
    });

    expect(res.delegateAddress).toBe(fakeAddress);
    expect(res).toMatchSnapshot();
  });

  it('returns undefined when no delegate is set', async () => {
    const fakePublicClient = {
      readContract: async () => '0x0000000000000000000000000000000000000000',
    } as unknown as PublicClient;

    const res = await getVoteDelegateAddress({
      publicClient: fakePublicClient,
      xvsVaultAddress: fakeAddress,
      accountAddress: fakeAddress,
    });

    expect(res.delegateAddress).toBeUndefined();
    expect(res).toMatchSnapshot();
  });
});
