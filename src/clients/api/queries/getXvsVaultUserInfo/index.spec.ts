import BigNumber from 'bignumber.js';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';

import { XvsVault } from 'packages/contracts';

import getXvsVaultUserInfo from '.';

const xvsTokenAddress = xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultUserInfo', () => {
  test('returns user info related to XVS vault in correct format on success', async () => {
    const getUserInfoMock = vi.fn(async () => xvsVaultResponses.userInfo);

    const fakeContract = {
      getUserInfo: getUserInfoMock,
    } as unknown as XvsVault;

    const response = await getXvsVaultUserInfo({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(getUserInfoMock).toHaveBeenCalledTimes(1);
    expect(getUserInfoMock).toHaveBeenCalledWith(xvsTokenAddress, fakePid, fakeAccountAddress);
    expect(response).toMatchSnapshot();
    expect(response.pendingWithdrawalsTotalAmountMantissa instanceof BigNumber).toBeTruthy();
    expect(response.rewardDebtAmountMantissa instanceof BigNumber).toBeTruthy();
    expect(response.stakedAmountMantissa instanceof BigNumber).toBeTruthy();
  });
});
