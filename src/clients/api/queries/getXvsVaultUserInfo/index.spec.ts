import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import fakeAccountAddress from '__mocks__/models/address';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import getXvsVaultUserInfo from '.';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultUserInfo', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getUserInfo: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultUserInfo({
        xvsVaultContract: fakeContract,
        tokenAddress: xvsTokenAddress,
        accountAddress: fakeAccountAddress,
        poolIndex: fakePid,
      });

      throw new Error('getXvsVaultTotalAllocationPoints should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns user info related to XVS vault in correct format on success', async () => {
    const callMock = jest.fn(async () => xvsVaultResponses.userInfo);
    const getUserInfoMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getUserInfo: getUserInfoMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultUserInfo({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getUserInfoMock).toHaveBeenCalledTimes(1);
    expect(getUserInfoMock).toHaveBeenCalledWith(xvsTokenAddress, fakePid, fakeAccountAddress);
    expect(response).toMatchSnapshot();
    expect(response.pendingWithdrawalsTotalAmountWei instanceof BigNumber).toBeTruthy();
    expect(response.rewardDebtAmountWei instanceof BigNumber).toBeTruthy();
    expect(response.stakedAmountWei instanceof BigNumber).toBeTruthy();
  });
});
