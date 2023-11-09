import { XvsVault } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import executeWithdrawalFromXvsVault from '.';

const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('executeWithdrawalFromXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const executeWithdrawalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      executeWithdrawal: executeWithdrawalMock,
    } as unknown as XvsVault;

    const response = await executeWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(executeWithdrawalMock).toHaveBeenCalledTimes(1);
    expect(executeWithdrawalMock).toHaveBeenCalledWith(fakeRewardTokenAddress, fakePoolIndex);
  });
});
