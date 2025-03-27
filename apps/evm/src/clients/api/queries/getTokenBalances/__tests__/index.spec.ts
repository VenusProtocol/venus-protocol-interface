import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';
import { bnb, busd, lisUsd } from '__mocks__/models/tokens';

import { getTokenBalances } from '..';

const tokens = [busd, lisUsd];

describe('getTokenBalances', () => {
  it('returns token balances in the right format on success', async () => {
    const fakePublicClient = {
      readContract: () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getTokenBalances({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      tokens,
    });

    expect(res).toMatchSnapshot();
  });

  it('returns token balances, including native token, in the right format on success', async () => {
    const fakePublicClient = {
      readContract: () => 1000000000000000000n,
      getBalance: () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getTokenBalances({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      tokens: [...tokens, bnb],
    });

    expect(res).toMatchSnapshot();
  });
});
