import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { VaiController } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';

import getVaiCalculateRepayAmount from '..';

describe('api/queries/getVaiCalculateRepayAmount', () => {
  test('returns the VAI fee', async () => {
    const vaiControllerContract = {
      callStatic: {
        accrueVAIInterest: vi.fn(),
      },
      getVAICalculateRepayAmount: vi.fn(async () => [
        BN.from('1000000'),
        BN.from('1000'),
        BN.from('100'),
      ]),
    } as unknown as VaiController;

    const response = await getVaiCalculateRepayAmount({
      accountAddress: fakeAddress,
      repayAmountMantissa: new BigNumber('10000'),
      vaiControllerContract,
    });

    expect(response).toMatchSnapshot();
  });
});
