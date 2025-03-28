import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVaiVaultPaused } from '..';

describe('getVaiVaultPaused', () => {
  it('returns VAI vault paused status in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => true,
    } as unknown as PublicClient;

    const res = await getVaiVaultPaused({
      publicClient: fakePublicClient,
      vaiVaultAddress: fakeAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
