import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VBep20 } from 'types/contracts';

import redeemUnderlying from '.';

vi.mock('errors/transactionErrors');

const fakeAmount = new BigNumber('10000000000000000');

describe('api/mutation/redeemUnderlying', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const redeemUnderlyingMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      redeemUnderlying: redeemUnderlyingMock,
    } as unknown as VBep20;

    const response = await redeemUnderlying({
      vTokenContract: fakeContract,
      amountWei: fakeAmount,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
