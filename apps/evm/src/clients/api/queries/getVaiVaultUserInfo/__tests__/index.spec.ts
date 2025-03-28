import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVaiVaultUserInfo } from '..';

describe('getVaiVaultUserInfo', () => {
  it('returns VAI vault user info in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => [1000000000000000000n],
    } as unknown as PublicClient;

    const res = await getVaiVaultUserInfo({
      publicClient: fakePublicClient,
      vaiVaultAddress: fakeAddress,
      accountAddress: fakeAddress,
    });

    expect(res.stakedVaiMantissa instanceof BigNumber).toBeTruthy();
    expect(res).toMatchSnapshot();
  });
});
