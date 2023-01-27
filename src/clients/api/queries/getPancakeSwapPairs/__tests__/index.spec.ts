import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { Multicall } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeTokenCombinations from '__mocks__/models/tokenCombinations';

import getPancakeSwapPairs from '..';

describe('api/queries/getPancakeSwapPairs', () => {
  test('returns pairs in the right format on success', async () => {
    const multicall = {
      call: jest.fn(async () => fakeMulticallResponses.pancakeSwapRouter.getReserves),
    } as unknown as Multicall;

    const res = await getPancakeSwapPairs({
      multicall,
      tokenCombinations: fakeTokenCombinations,
    });

    expect(multicall.call).toHaveBeenCalledTimes(1);
    expect((multicall.call as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });

  test('skips token combinations for which a pair address could not be generated', async () => {
    const multicall = {
      call: jest.fn(async () => fakeMulticallResponses.pancakeSwapRouter.getReserves),
    } as unknown as Multicall;

    const customFakeTokenCombinations = [...fakeTokenCombinations];
    customFakeTokenCombinations[0][0] = undefined as unknown as PSToken;

    const res = await getPancakeSwapPairs({
      multicall,
      tokenCombinations: customFakeTokenCombinations,
    });

    expect(res).toMatchSnapshot();
  });
});
