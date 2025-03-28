import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVaiTreasuryPercentage } from '..';

describe('getVaiTreasuryPercentage', () => {
  it('returns VAI treasury percentage in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getVaiTreasuryPercentage({
      publicClient: fakePublicClient,
      vaiControllerAddress: fakeAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
