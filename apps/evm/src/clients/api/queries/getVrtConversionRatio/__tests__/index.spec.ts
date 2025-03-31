import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { getVrtConversionRatio } from '..';

describe('getVrtConversionRatio', () => {
  it('returns VRT conversion ratio in the right format on success', async () => {
    const fakePublicClient = {
      readContract: async () => 1000000000000000000n,
    } as unknown as PublicClient;

    const res = await getVrtConversionRatio({
      publicClient: fakePublicClient,
      vrtConverterAddress: fakeAddress,
    });

    expect(res.conversionRatio.toString()).toBe('1000000000000000000');
    expect(res).toMatchSnapshot();
  });
});
