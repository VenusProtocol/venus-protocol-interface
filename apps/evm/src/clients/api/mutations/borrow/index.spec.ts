import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { VBep20 } from 'packages/contracts';

import borrow from '.';

describe('borrow', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountMantissa = new BigNumber('10000000000000000');
    const borrowMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      borrow: borrowMock,
    } as unknown as VBep20;

    const response = await borrow({
      vTokenContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(borrowMock).toHaveBeenCalledTimes(1);
    expect(borrowMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
