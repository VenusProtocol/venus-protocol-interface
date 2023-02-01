import { checkForVaiVaultTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VaiVault } from 'types/contracts';

import claimVaiVaultReward from '.';

jest.mock('errors/transactionErrors');

describe('api/mutation/claimVaiVaultReward', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const claimMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      claim: claimMock,
    } as unknown as VaiVault;

    const response = await claimVaiVaultReward({
      vaiVaultContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(claimMock).toHaveBeenCalledTimes(1);
    expect(claimMock).toHaveBeenCalledWith();
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
