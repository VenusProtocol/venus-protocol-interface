import { VBep20 } from 'types/contracts';

import getVTokenBalance from '.';

describe('api/queries/getVTokenBalance', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        balanceOf: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await getVTokenBalance({
        vTokenContract: fakeContract,
        accountAddress: '0x23da',
      });

      throw new Error('getVTokenBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });
});
