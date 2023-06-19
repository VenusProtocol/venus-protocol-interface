import { Multicall } from 'ethereum-multicall';
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
    const fakeMulticall = {
      call: vi.fn(async () => fakeMulticallResponses.bep20.balanceOfTokens),
    } as unknown as Multicall;

    const res = await getTokenBalances({
      provider: fakeProvider,
      multicall: fakeMulticall,
      accountAddress: fakeAccountAddress,
      tokens,
    });

    expect(fakeMulticall.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });

  test('returns token balances, including BNB, in the right format on success', async () => {
    const fakeMulticall = {
      call: vi.fn(async () => fakeMulticallResponses.bep20.balanceOfTokens),
    } as unknown as Multicall;

    const res = await getTokenBalances({
      provider: fakeProvider,
      multicall: fakeMulticall,
      accountAddress: fakeAccountAddress,
      tokens: tokensWithBnB,
    });

    expect(fakeMulticall.call).toHaveBeenCalledTimes(1);
    expect((fakeMulticall.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });
});
