import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVenusVaiVaultDailyRate } from '..';

describe('getVenusVaiVaultDailyRate', () => {
  it('returns VAI vault daily rate in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getVenusVaiVaultDailyRate({
      publicClient: fakePublicClient,
      legacyPoolComptrollerAddress: fakeAddress,
      blocksPerDay: 28800,
    });

    expect(res.dailyRateMantissa instanceof BigNumber).toBeTruthy();
    expect(res).toMatchSnapshot();
  });
});
