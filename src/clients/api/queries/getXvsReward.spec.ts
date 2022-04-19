import getVTokenBalancesAll from './getVTokenBalancesAll';

describe('api/queries/getVTokenBalancesAll', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        vTokenBalancesAll: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await getVTokenBalancesAll({
        venusLensContract: fakeContract,
        vtAddresses: [''],
        account: '0x23da',
      });

      throw new Error('getVTokenBalancesAll should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });
});
