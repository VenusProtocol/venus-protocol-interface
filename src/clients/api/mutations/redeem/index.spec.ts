import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VBep20 } from 'types/contracts';

import redeem from '.';

const fakeAmount = new BigNumber('10000000000000000');

jest.mock('errors/transactionErrors');

describe('api/mutation/redeem', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const redeemMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      redeem: redeemMock,
    } as unknown as VBep20;

    const response = await redeem({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(redeemMock).toHaveBeenCalledTimes(1);
    expect(redeemMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
