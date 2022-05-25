import getHypotheticalAccountLiquidity from './getHypotheticalAccountLiquidity';

describe('api/queries/getHypotheticalAccountLiquidity', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getHypotheticalAccountLiquidity: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await getHypotheticalAccountLiquidity({
        comptrollerContract: fakeContract,
        account: '0xq3k9',
        vtokenAddress: '0xq3k9',
        balanceOf: '',
        borrowAmount: 0,
      });

      throw new Error('getHypotheticalAccountLiquidity should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('with account return asset with updated hypothetical Account Liquidity', async () => {
    const fakeContract = {
      methods: {
        getHypotheticalAccountLiquidity: () => ({
          call: async () => ['3', '4', '5'],
        }),
      },
    } as unknown as any;

    const response = await getHypotheticalAccountLiquidity({
      comptrollerContract: fakeContract,
      account: '0x34111',
      vtokenAddress: '0xq3k9',
      balanceOf: '',
      borrowAmount: 0,
    });
    expect(response).toStrictEqual(['3', '4', '5']);
  });
});
