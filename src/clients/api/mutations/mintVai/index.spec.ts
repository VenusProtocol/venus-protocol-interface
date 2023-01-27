import BigNumber from 'bignumber.js';
import { checkForVaiControllerTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VaiUnitroller } from 'types/contracts';

import mintVai from '.';

jest.mock('errors/transactionErrors');

describe('api/mutation/mintVai', () => {
  test('returns contract receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const mintVaiMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      mintVAI: mintVaiMock,
    } as unknown as VaiUnitroller;

    const response = await mintVai({
      vaiControllerContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(mintVaiMock).toHaveBeenCalledTimes(1);
    expect(mintVaiMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForVaiControllerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForVaiControllerTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
