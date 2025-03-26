import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVaiRepayApr } from '..';

describe('getVaiRepayApr', () => {
  it('returns VAI repay APR in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getVaiRepayApr({
      publicClient: fakePublicClient,
      vaiControllerAddress: fakeAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
