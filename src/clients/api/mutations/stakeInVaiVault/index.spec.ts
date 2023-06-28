import BigNumber from 'bignumber.js';
import { checkForVaiVaultTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VaiVault } from 'types/contracts';

import stakeInVaiVault from '.';

vi.mock('errors/transactionErrors');

const fakeAmountWei = new BigNumber('1000000000000');

describe('api/mutation/stakeInVaiVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const depositMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      deposit: depositMock,
    } as unknown as VaiVault;

    const response = await stakeInVaiVault({
      vaiVaultContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
