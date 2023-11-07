import BigNumber from 'bignumber.js';
import { VBep20 } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import borrow from '.';

describe('borrow', () => {
  test('returns contract transaction when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const borrowMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      borrow: borrowMock,
    } as unknown as VBep20;

    const response = await borrow({
      vTokenContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(borrowMock).toHaveBeenCalledTimes(1);
    expect(borrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
  });
});
