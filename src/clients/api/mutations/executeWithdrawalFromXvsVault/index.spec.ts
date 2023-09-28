import { XvsVault } from 'packages/contractsNew';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import executeWithdrawalFromXvsVault from '.';

const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('api/mutation/executeWithdrawalFromXvsVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const executeWithdrawalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      executeWithdrawal: executeWithdrawalMock,
    } as unknown as XvsVault;

    const response = await executeWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(executeWithdrawalMock).toHaveBeenCalledTimes(1);
    expect(executeWithdrawalMock).toHaveBeenCalledWith(fakeRewardTokenAddress, fakePoolIndex);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
