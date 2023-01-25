import BigNumber from 'bignumber.js';

import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import fakeAddress from '__mocks__/models/address';
import { VaiVault } from 'types/contracts';

import getVaiVaultUserInfo from '.';

describe('api/queries/getVaiVaultUserInfo', () => {
  test('returns the user info in the correct format', async () => {
    const userInfoMock = jest.fn(async () => vaiVaultResponses.userInfo);

    const fakeContract = {
      userInfo: userInfoMock,
    } as unknown as VaiVault;

    const response = await getVaiVaultUserInfo({
      vaiVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(userInfoMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.stakedVaiWei instanceof BigNumber).toBeTruthy();
  });
});
