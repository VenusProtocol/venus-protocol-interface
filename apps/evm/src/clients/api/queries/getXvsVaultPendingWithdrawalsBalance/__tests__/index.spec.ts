import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import type { XvsVault } from 'libs/contracts';

import { getXvsVaultPendingWithdrawalsBalance } from '..';

const fakeTokenAddress = '0x0';
const fakePid = 0;
const fakeAmount = BN.from('1000000');

describe('getXvsVaultPendingWithdrawalsBalance', () => {
  it('returns total amount of pending withdrawals in that XVS vault', async () => {
    const totalPendingWithdrawalsMock = vi.fn(async () => fakeAmount);

    const fakeContract = {
      totalPendingWithdrawals: totalPendingWithdrawalsMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultPendingWithdrawalsBalance({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeTokenAddress,
      poolIndex: fakePid,
    });

    expect(totalPendingWithdrawalsMock).toHaveBeenCalledTimes(1);
    expect(totalPendingWithdrawalsMock).toHaveBeenCalledWith(fakeTokenAddress, fakePid);
    expect(response).toMatchSnapshot();
    expect(response.balanceMantissa instanceof BigNumber).toBeTruthy();
  });
});
