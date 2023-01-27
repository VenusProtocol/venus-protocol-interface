import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VrtVault } from 'types/contracts';

import withdrawFromVrtVault from '.';

describe('api/mutation/withdrawFromVrtVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const withdrawMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      withdraw: withdrawMock,
    } as unknown as VrtVault;

    const response = await withdrawFromVrtVault({
      vrtVaultContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(withdrawMock).toHaveBeenCalledTimes(1);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
