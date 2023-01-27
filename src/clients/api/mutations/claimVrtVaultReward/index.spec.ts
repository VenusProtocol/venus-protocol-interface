import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VrtVault } from 'types/contracts';

import claimVrtVaultReward from '.';

describe('api/mutation/claimVrtVaultReward', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const claimMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      claim: claimMock,
    } as unknown as VrtVault;

    const response = await claimVrtVaultReward({
      vrtVaultContract: fakeContract,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(claimMock).toHaveBeenCalledTimes(1);
    expect(claimMock).toHaveBeenCalledWith();
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
