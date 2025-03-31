import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVrtConversionEndTime } from '..';

describe('getVrtConversionEndTime', () => {
  it('returns VRT conversion end time in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000n,
    } as unknown as PublicClient;

    const res = await getVrtConversionEndTime({
      publicClient: fakePublicClient,
      vrtConverterAddress: fakeAddress,
    });

    expect(res.conversionEndTime instanceof Date).toBeTruthy();
    expect(res.conversionEndTime.getTime()).toBe(1000000000000);
    expect(res).toMatchSnapshot();
  });
});
