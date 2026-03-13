import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';
import { busd } from '__mocks__/models/tokens';

import { getTokenListUsdPrice } from '..';

describe('getTokenListUsdPrice', () => {
  it('returns tokens price in USD in the right format on success', async () => {
    const fakePublicClient = {
      multicall: async () => [{ status: 'success', result: 1000000000000000000n }],
    } as unknown as PublicClient;

    const res = await getTokenListUsdPrice({
      publicClient: fakePublicClient,
      tokens: [busd],
      resilientOracleAddress: fakeAddress,
    });

    expect(res).toMatchSnapshot();
  });
});
