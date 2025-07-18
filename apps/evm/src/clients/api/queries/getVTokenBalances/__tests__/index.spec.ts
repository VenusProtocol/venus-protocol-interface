import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';
import { vBnb, vUsdc, vXvs } from '__mocks__/models/vTokens';

import { getVTokenBalances } from '..';

const vTokens = [vBnb, vXvs, vUsdc];

describe('getVTokenBalances', () => {
  it('returns token balances in the right format on success', async () => {
    const fakePublicClient = {
      multicall: () =>
        vTokens.map(() => ({
          status: 'success',
          result: 100000000000000000n,
        })),
    } as unknown as PublicClient;

    const res = await getVTokenBalances({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      vTokens,
    });

    expect(res).toMatchSnapshot();
  });
});
