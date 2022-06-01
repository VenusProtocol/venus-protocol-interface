import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts';
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
    } as unknown as Comptroller;

    try {
      await getHypotheticalAccountLiquidity({
        comptrollerContract: fakeContract,
        accountAddress: '0xq3k9',
        vTokenAddress: '0xq3k9',
        vTokenBalanceOfWei: new BigNumber(0),
        vTokenBorrowAmountWei: new BigNumber(0),
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
          call: async () => ({ 0: '3', 1: '4', 2: '5' }),
        }),
      },
    } as unknown as Comptroller;

    const response = await getHypotheticalAccountLiquidity({
      comptrollerContract: fakeContract,
      accountAddress: '0x34111',
      vTokenAddress: '0xq3k9',
      vTokenBalanceOfWei: new BigNumber(0),
      vTokenBorrowAmountWei: new BigNumber(0),
    });
    expect(response).toStrictEqual({ 0: '3', 1: '4', 2: '5' });
  });
});
