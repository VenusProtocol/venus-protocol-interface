import BigNumber from 'bignumber.js';
import { XvsVault } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade from '.';

const fakeTokenAddress = '0x0';
const fakePid = 0;
const fakeAmount = new BigNumber(1000);

describe('api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade', () => {
  test('returns total amount of pending withdrawals before the contract upgrade on success', async () => {
    const pendingWithdrawalsBeforeUpgradeMock = vi.fn(async () => fakeAmount);

    const fakeContract = {
      pendingWithdrawalsBeforeUpgrade: pendingWithdrawalsBeforeUpgradeMock,
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
    expect(response.pendingWithdrawalsFromBeforeUpgradeMantissa instanceof BigNumber).toBeTruthy();
  });
});
