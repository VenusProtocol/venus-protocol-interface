import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { VBep20 } from 'libs/contracts';

import redeem from '.';

const fakeAmount = new BigNumber('10000000000000000');

describe('redeem', () => {
  test('returns contract transaction when request succeeds', async () => {
    const redeemMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      redeem: redeemMock,
    } as unknown as VBep20;

    const response = await redeem({
      tokenContract: fakeContract,
      amountMantissa: fakeAmount,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(redeemMock).toHaveBeenCalledTimes(1);
    expect(redeemMock).toHaveBeenCalledWith(fakeAmount.toFixed());
  });
});
