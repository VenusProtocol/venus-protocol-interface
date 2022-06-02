import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import { VError } from 'errors';
import fakeAccountAddress from '__mocks__/models/address';
import getXvsVaultUserInfo from './getXvsVaultUserInfo';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultUserInfo', () => {
  test('throws an error when providing an invalid token address', async () => {
    const fakeContract = {
      methods: {
        getUserInfo: () => ({
          call: jest.fn(),
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultUserInfo({
        xvsVaultContract: fakeContract,
        tokenAddress: 'invalid token address',
        accountAddress: fakeAccountAddress,
        pid: fakePid,
      });

      throw new Error('getXvsVaultUserInfo should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      expect(error).toMatchInlineSnapshot('[Error: invalidTokenAddressProvided]');
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.code).toBe('invalidTokenAddressProvided');
      }
    }
  });

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
        pid: fakePid,
      });

      throw new Error('getXvsVaultTotalAllocPoints should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns user info related to XVS vault in correct format on success', async () => {
    const callMock = jest.fn(async () => ({
      amount: '36',
      pendingWithdrawals: '54',
      rewardDebt: '18',
    }));
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
      pid: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getUserInfoMock).toHaveBeenCalledTimes(1);
    expect(getUserInfoMock).toHaveBeenCalledWith(xvsTokenAddress, fakePid, fakeAccountAddress);
    expect(response).toStrictEqual({
      pendingWithdrawalsTotalAmountWei: new BigNumber('3000000000000000000'),
      rewardDebtAmountWei: new BigNumber('1000000000000000000'),
      stakedAmountWei: new BigNumber('2000000000000000000'),
    });
  });
});
