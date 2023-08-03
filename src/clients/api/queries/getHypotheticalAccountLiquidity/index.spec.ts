import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import compTrollerResponses from '__mocks__/contracts/comptroller';

import getHypotheticalAccountLiquidity from '.';

describe('api/queries/getHypotheticalAccountLiquidity', () => {
  test('with account return asset with updated hypothetical Account Liquidity', async () => {
    const fakeContract = {
      getHypotheticalAccountLiquidity: async () =>
        compTrollerResponses.getHypotheticalAccountLiquidity,
    } as unknown as ContractTypeByName<'mainPoolComptroller'>;

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
