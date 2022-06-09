import BigNumber from 'bignumber.js';
import fakeAddress from '__mocks__/models/address';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import { VaiVault } from 'types/contracts';
import getVaiVaultUserInfo from '.';

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
    const callMock = jest.fn(async () => vaiVaultResponses.userInfo);
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
    expect(response).toMatchSnapshot();
    expect(response.stakedVaiWei instanceof BigNumber).toBeTruthy();
  });
});
