import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { busd } from '__mocks__/models/tokens';

import { getTokenUsdPrice } from '..';

describe('getTokenUsdPrice', () => {
  it('returns token price in USD in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getTokenUsdPrice({
      publicClient: fakePublicClient,
      token: busd,
      resilientOracleAddress: fakeAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
