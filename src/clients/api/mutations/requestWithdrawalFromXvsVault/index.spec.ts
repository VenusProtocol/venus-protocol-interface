import BigNumber from 'bignumber.js';
import { checkForXvsVaultProxyTransactionError } from 'errors';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { XvsVault } from 'types/contracts';

import requestWithdrawalFromXvsVault from '.';

vi.mock('errors/transactionErrors');

const fakeAmountWei = new BigNumber('1000000000000');
const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('api/mutation/requestWithdrawalFromXvsVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const requestWithdrawalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      requestWithdrawal: requestWithdrawalMock,
    } as unknown as XvsVault;

    const response = await requestWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      amountWei: fakeAmountWei,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(requestWithdrawalMock).toHaveBeenCalledTimes(1);
    expect(requestWithdrawalMock).toHaveBeenCalledWith(
      fakeRewardTokenAddress,
      fakePoolIndex,
      fakeAmountWei.toFixed(),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledWith(fakeContractReceipt);
  });
});
