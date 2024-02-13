import BigNumber from 'bignumber.js';
import { VBep20 } from 'libs/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import redeemUnderlying from '.';

const fakeAmount = new BigNumber('10000000000000000');

describe('redeemUnderlying', () => {
  test('returns contract transaction when request succeeds', async () => {
    const redeemUnderlyingMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      redeemUnderlying: redeemUnderlyingMock,
    } as unknown as VBep20;

    const response = await redeemUnderlying({
      vTokenContract: fakeContract,
      amountMantissa: fakeAmount,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmount.toFixed());
  });
});
