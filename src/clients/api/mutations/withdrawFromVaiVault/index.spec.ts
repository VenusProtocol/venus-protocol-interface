import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VaiVault } from 'types/contracts';

import withdrawFromVaiVault from '.';

jest.mock('errors/transactionErrors');

const fakeAmountWei = new BigNumber('1000000000000');

describe('api/mutation/withdrawFromVaiVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const withdrawMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      withdraw: withdrawMock,
    } as unknown as VaiVault;

    const response = await withdrawFromVaiVault({
      vaiVaultContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(withdrawMock).toHaveBeenCalledTimes(1);
    expect(withdrawMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
