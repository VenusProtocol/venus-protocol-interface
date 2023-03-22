import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { XvsVault } from 'types/contracts';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade from '.';

const fakeTokenAddress = '0x0';
const fakePid = 0;
const fakeAmountWei = new BigNumber(1000);

describe('api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade', () => {
  test('returns total amount of pending withdrawals before the contract upgrade on success', async () => {
    const callMock = jest.fn(async () => fakeAmountWei);
    const pendingWithdrawalsBeforeUpgradeMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        pendingWithdrawalsBeforeUpgrade: pendingWithdrawalsBeforeUpgradeMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPendingWithdrawalsFromBeforeUpgrade({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeTokenAddress,
      poolIndex: fakePid,
      accountAddress: fakeAddress,
    });

    expect(pendingWithdrawalsBeforeUpgradeMock).toHaveBeenCalledTimes(1);
    expect(pendingWithdrawalsBeforeUpgradeMock).toHaveBeenCalledWith(
      fakeTokenAddress,
      fakePid,
      fakeAddress,
    );
    expect(response).toMatchSnapshot();
    expect(response.pendingWithdrawalsFromBeforeUpgradeWei instanceof BigNumber).toBeTruthy();
  });
});
