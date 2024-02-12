import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { VaiController } from 'packages/contracts';

import repayVai from '.';

describe('repayVai', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountMantissa = new BigNumber('10000000000000000');

    const repayVAIMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      repayVAI: repayVAIMock,
    } as unknown as VaiController;

    const response = await repayVai({
      vaiControllerContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(repayVAIMock).toHaveBeenCalledTimes(1);
    expect(repayVAIMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
