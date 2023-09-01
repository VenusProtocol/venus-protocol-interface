import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

import getPancakeSwapPairs from '..';

describe('api/queries/getPancakeSwapPairs', () => {
  test('returns pairs in the right format on success', async () => {
    const multicall3 = {
      call: vi.fn(async () => fakeMulticallResponses.pancakeSwapRouter.getReserves),
    } as unknown as Multicall3;

    const res = await getPancakeSwapPairs({
      multicall3,
      tokenCombinations: fakeTokenCombinations,
    });

    expect(multicall3.call).toHaveBeenCalledTimes(1);
    expect((multicall3.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });

  test('skips token combinations for which a pair address could not be generated', async () => {
    const multicall3 = {
      call: vi.fn(async () => fakeMulticallResponses.pancakeSwapRouter.getReserves),
    } as unknown as Multicall3;

    const customFakeTokenCombinations = [...fakeTokenCombinations];
    customFakeTokenCombinations[0][0] = undefined as unknown as PSToken;

    const res = await getPancakeSwapPairs({
      multicall3,
      tokenCombinations: customFakeTokenCombinations,
    });

    expect(res).toMatchSnapshot();
  });
});
