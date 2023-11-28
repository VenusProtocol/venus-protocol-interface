import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { XvsVault } from 'packages/contracts';

import requestWithdrawalFromXvsVault from '.';

const fakeAmountMantissa = new BigNumber('1000000000000');
const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('requestWithdrawalFromXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const requestWithdrawalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      requestWithdrawal: requestWithdrawalMock,
    } as unknown as XvsVault;

    const response = await requestWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      amountMantissa: fakeAmountMantissa,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(requestWithdrawalMock).toHaveBeenCalledTimes(1);
    expect(requestWithdrawalMock).toHaveBeenCalledWith(
      fakeRewardTokenAddress,
      fakePoolIndex,
      fakeAmountMantissa.toFixed(),
    );
  });
});
