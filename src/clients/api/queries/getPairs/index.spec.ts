import { Multicall } from 'ethereum-multicall';

import getPairs from '.';

describe('api/queries/getPairs', () => {
  test('throws an error when request fails', async () => {
    const multicall = {
      call: async () => {
        throw new Error('Fake error message');
      },
    } as unknown as Multicall;

    try {
      await getPairs({
        multicall,
        tokenCombinations: [],
      });

      throw new Error('getPairs should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  // TODO: add tests
});
