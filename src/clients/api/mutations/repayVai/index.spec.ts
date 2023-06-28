import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VaiController } from 'types/contracts';

import repayVai from '.';

vi.mock('errors/transactionErrors');

describe('api/mutation/repayVai', () => {
  test('returns contract receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const repayVAIMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      repayVAI: repayVAIMock,
    } as unknown as VaiController;

    const response = await repayVai({
      vaiControllerContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(repayVAIMock).toHaveBeenCalledTimes(1);
    expect(repayVAIMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForVaiControllerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForVaiControllerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
