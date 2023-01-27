import BigNumber from 'bignumber.js';

import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import fakeAddress from '__mocks__/models/address';
import { VrtVault } from 'types/contracts';

import getVrtVaultUserInfo from '.';

describe('api/queries/getVrtVaultUserInfo', () => {
  test('returns the user info in the correct format', async () => {
    const userInfoMock = jest.fn(async () => vrtVaultResponses.userInfo);

    const fakeContract = {
      userInfo: userInfoMock,
    } as unknown as VrtVault;

    const response = await getVrtVaultUserInfo({
      vrtVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(userInfoMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.stakedVrtWei instanceof BigNumber).toBeTruthy();
  });
});
