import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import fakeAddress from '__mocks__/models/address';

import getVaiVaultUserInfo from '.';

describe('api/queries/getVaiVaultUserInfo', () => {
  test('returns the user info in the correct format', async () => {
    const userInfoMock = vi.fn(async () => vaiVaultResponses.userInfo);

    const fakeContract = {
      userInfo: userInfoMock,
    } as unknown as ContractTypeByName<'vaiVault'>;

    const response = await getVaiVaultUserInfo({
      vaiVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(userInfoMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
    expect(response.stakedVaiWei instanceof BigNumber).toBeTruthy();
  });
});
