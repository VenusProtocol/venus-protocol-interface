import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VTokenContract } from 'clients/contracts/types';

import borrow from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/borrow', () => {
  test('returns contract receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const borrowMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      borrow: borrowMock,
    } as unknown as VTokenContract<'xvs'>;

    const response = await borrow({
      vTokenContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(borrowMock).toHaveBeenCalledTimes(1);
    expect(borrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
