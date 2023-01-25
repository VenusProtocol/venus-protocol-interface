import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import fakeAddress from '__mocks__/models/address';
import { VaiVault } from 'types/contracts';

import getVaiVaultPendingXvs from '.';

describe('api/queries/getVaiVaultPendingXvs', () => {
  test('returns the pending XVS value in the correct format', async () => {
    const fakePendingXvsWei = BN.from('1000000000000000000000000000');
    const pendingXvsMock = jest.fn(async () => fakePendingXvsWei);

    const fakeContract = {
      pendingXVS: pendingXvsMock,
    } as unknown as VaiVault;

    const response = await getVaiVaultPendingXvs({
      vaiVaultContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(pendingXvsMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      pendingXvsWei: new BigNumber(fakePendingXvsWei.toString()),
    });
  });
});
