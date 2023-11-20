import BigNumber from 'bignumber.js';
import { LegacyPoolComptroller } from 'packages/contracts';

import compTrollerResponses from '__mocks__/contracts/legacyPoolComptroller';

import getHypotheticalAccountLiquidity from '.';

describe('api/queries/getHypotheticalAccountLiquidity', () => {
  test('with account return asset with updated hypothetical Account Liquidity', async () => {
    const fakeContract = {
      getHypotheticalAccountLiquidity: async () =>
        compTrollerResponses.getHypotheticalAccountLiquidity,
    } as unknown as LegacyPoolComptroller;

    const response = await getHypotheticalAccountLiquidity({
      comptrollerContract: fakeContract,
      accountAddress: '0x34111',
      vTokenAddress: '0xq3k9',
      vTokenBalanceOfMantissa: new BigNumber(0),
      vTokenBorrowAmountMantissa: new BigNumber(0),
    });
    expect(response).toMatchSnapshot();
  });
});
