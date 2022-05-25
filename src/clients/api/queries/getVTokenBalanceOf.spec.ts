import getVTokenBalance from './getVTokenBalanceOf';

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
    } as any;

    try {
      await getVTokenBalance({
        tokenContract: fakeContract,
        account: '0x23da',
      });

      throw new Error('getVTokenBalance should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });
});
