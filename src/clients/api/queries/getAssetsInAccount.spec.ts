import getAssetsInAccount from './getAssetsInAccount';

describe('api/queries/getAssetsInAccount', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getAssetsIn: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await getAssetsInAccount({ comptrollerContract: fakeContract, account: '0x2398' });
      throw new Error('getAssetsInAccount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });
});
