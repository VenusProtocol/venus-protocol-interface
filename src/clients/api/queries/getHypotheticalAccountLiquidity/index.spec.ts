import BigNumber from 'bignumber.js';
import { MainPoolComptroller } from 'packages/contractsNew';

import compTrollerResponses from '__mocks__/contracts/mainPoolComptroller';

import getHypotheticalAccountLiquidity from '.';

describe('api/queries/getHypotheticalAccountLiquidity', () => {
  test('with account return asset with updated hypothetical Account Liquidity', async () => {
    const fakeContract = {
      getHypotheticalAccountLiquidity: async () =>
        compTrollerResponses.getHypotheticalAccountLiquidity,
    } as unknown as MainPoolComptroller;

    const response = await getHypotheticalAccountLiquidity({
      comptrollerContract: fakeContract,
      accountAddress: '0x34111',
      vTokenAddress: '0xq3k9',
      vTokenBalanceOfWei: new BigNumber(0),
      vTokenBorrowAmountWei: new BigNumber(0),
    });
    expect(response).toMatchSnapshot();
  });
});
