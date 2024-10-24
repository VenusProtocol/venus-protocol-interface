import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { VaiController } from 'libs/contracts';

import repayVai from '.';

describe('repayVai', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountMantissa = new BigNumber('10000000000000000');

    const repayVAIMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      repayVAI: repayVAIMock,
    } as unknown as VaiController;

    const response = repayVai({
      vaiControllerContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeAmountMantissa.toFixed()],
      methodName: 'repayVAI',
    });
  });
});
