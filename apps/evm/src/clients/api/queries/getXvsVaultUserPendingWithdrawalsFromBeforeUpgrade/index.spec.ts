import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';

import type { XvsVault } from 'libs/contracts';

import getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade from '.';

const fakeTokenAddress = '0x0';
const fakePid = 0;
const fakeAmount = new BigNumber(1000);

describe('api/queries/getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade', () => {
  test('returns total amount of pending withdrawals before the contract upgrade on success', async () => {
    const pendingWithdrawalsBeforeUpgradeMock = vi.fn(async () => fakeAmount);

    const fakeContract = {
      pendingWithdrawalsBeforeUpgrade: pendingWithdrawalsBeforeUpgradeMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade({
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
    expect(
      response.userPendingWithdrawalsFromBeforeUpgradeMantissa instanceof BigNumber,
    ).toBeTruthy();
  });
});
