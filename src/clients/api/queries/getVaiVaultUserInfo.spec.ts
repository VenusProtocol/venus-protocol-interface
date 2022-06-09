import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { VaiVault } from 'types/contracts';
import getVaiVaultUserInfo from './getVaiVaultUserInfo';

describe('api/queries/getVaiVaultUserInfo', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        userInfo: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiVault;

    try {
      await getVaiVaultUserInfo({
        vaiVaultContract: fakeContract,
        accountAddress: fakeAddress,
      });

      throw new Error('getVaiVaultUserInfo should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the user info in the correct format', async () => {
    const fakeStakedVaiWei = new BigNumber('1000000000000000000000000000');
    const callMock = jest.fn(async () => ({
      amount: '1000',
      rewardDebt: '2000',
      0: fakeStakedVaiWei,
      1: '4000',
    }));
    const userInfoMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        userInfo: userInfoMock,
      },
    } as unknown as VaiVault;

    const response = await getVaiVaultUserInfo({
      vaiVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(userInfoMock).toHaveBeenCalledTimes(1);
    expect(response).toStrictEqual({
      stakedVaiWei: fakeStakedVaiWei,
    });
  });
});
