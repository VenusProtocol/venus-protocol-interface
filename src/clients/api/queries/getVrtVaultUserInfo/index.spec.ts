import BigNumber from 'bignumber.js';
import fakeAddress from '__mocks__/models/address';
import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import { VrtVault } from 'types/contracts';
import getVrtVaultUserInfo from '.';

describe('api/queries/getVrtVaultUserInfo', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        userInfo: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtVault;

    try {
      await getVrtVaultUserInfo({
        vrtVaultContract: fakeContract,
        accountAddress: fakeAddress,
      });

      throw new Error('getVrtVaultUserInfo should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the user info in the correct format', async () => {
    const callMock = jest.fn(async () => vrtVaultResponses.userInfo);
    const userInfoMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        userInfo: userInfoMock,
      },
    } as unknown as VrtVault;

    const response = await getVrtVaultUserInfo({
      vrtVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(userInfoMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.stakedVrtWei instanceof BigNumber).toBeTruthy();
  });
});
