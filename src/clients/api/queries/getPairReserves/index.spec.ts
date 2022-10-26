import { Multicall } from 'ethereum-multicall';

import getPairReserves from '.';

describe('api/queries/getPairReserves', () => {
  test('throws an error when request fails', async () => {
    const multicall = {
      call: async () => {
        throw new Error('Fake error message');
      },
    } as unknown as Multicall;

    try {
      await getPairReserves({
        multicall,
        tokenCombinations: [],
      });

      throw new Error('getPairReserves should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  // TODO: add tests
});
