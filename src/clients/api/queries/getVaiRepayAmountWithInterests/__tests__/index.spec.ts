import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';

import getVaiRepayAmountWithInterests from '..';

const fakeVaiRepayAmountWithInterests = BN.from('10000000000');

describe('api/queries/getVaiRepayAmountWithInterests', () => {
  test('returns the VAI fee with interests', async () => {
    const vaiControllerContract = {
      callStatic: {
        accrueVAIInterest: vi.fn(),
      },
      getVAIRepayAmount: vi.fn(async () => fakeVaiRepayAmountWithInterests),
    } as unknown as ContractTypeByName<'vaiController'>;

    const response = await getVaiRepayAmountWithInterests({
      accountAddress: fakeAddress,
      vaiControllerContract,
    });

    expect(response).toMatchSnapshot();
  });
});
