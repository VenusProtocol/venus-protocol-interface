import { Multicall as Multicall3 } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAccountAddress from '__mocks__/models/address';
import fakeProvider from '__mocks__/models/provider';
import { SWAP_TOKENS } from 'constants/tokens';

import getTokenBalances from '.';

const tokens = [SWAP_TOKENS.busd, SWAP_TOKENS.cake];
const tokensWithBnB = [...tokens, SWAP_TOKENS.bnb];

describe('api/queries/getTokenBalances', () => {
  test('returns token balances in the right format on success', async () => {
    const fakeMulticall3 = {
      call: vi.fn(async () => fakeMulticallResponses.bep20.balanceOfTokens),
    } as unknown as Multicall3;

    const res = await getTokenBalances({
      provider: fakeProvider,
      multicall3: fakeMulticall3,
      accountAddress: fakeAccountAddress,
      tokens,
    });

    expect(fakeMulticall3.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall3.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });

  test('returns token balances, including BNB, in the right format on success', async () => {
    const fakeMulticall3 = {
      call: vi.fn(async () => fakeMulticallResponses.bep20.balanceOfTokens),
    } as unknown as Multicall3;

    const res = await getTokenBalances({
      provider: fakeProvider,
      multicall3: fakeMulticall3,
      accountAddress: fakeAccountAddress,
      tokens: tokensWithBnB,
    });

    expect(fakeMulticall3.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall3.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });
});
