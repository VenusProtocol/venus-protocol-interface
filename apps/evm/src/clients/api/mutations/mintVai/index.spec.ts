import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { VaiController } from 'libs/contracts';

import mintVai from '.';

describe('mintVai', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountMantissa = new BigNumber('10000000000000000');

    const mintVaiMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      mintVAI: mintVaiMock,
    } as unknown as VaiController;

    const response = mintVai({
      vaiControllerContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeAmountMantissa.toFixed()],
      methodName: 'mintVAI',
    });
  });
});
