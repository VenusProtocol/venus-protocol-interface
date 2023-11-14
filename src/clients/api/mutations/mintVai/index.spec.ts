import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import mintVai from '.';

describe('mintVai', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountMantissa = new BigNumber('10000000000000000');

    const mintVaiMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      mintVAI: mintVaiMock,
    } as unknown as VaiController;

    const response = await mintVai({
      vaiControllerContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(mintVaiMock).toHaveBeenCalledTimes(1);
    expect(mintVaiMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
