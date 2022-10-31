import { Multicall } from 'ethereum-multicall';

import getPancakeSwapPairs from '.';

describe('api/queries/getPancakeSwapPairs', () => {
  test('throws an error when request fails', async () => {
    const multicall = {
      call: async () => {
        throw new Error('Fake error message');
      },
    } as unknown as Multicall;

    try {
      await getPancakeSwapPairs({
        multicall,
        tokenCombinations: [],
      });

      throw new Error('getPancakeSwapPairs should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  // TODO: add tests
});
