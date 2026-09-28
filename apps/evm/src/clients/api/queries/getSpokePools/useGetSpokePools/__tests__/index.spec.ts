import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { spokePools } from '__mocks__/models/spokePools';
import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';
import { useGetPoolsQuery } from 'clients/api/queries/useGetPools/useGetPoolsQuery';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';

import { useGetSpokePools } from '..';
import { getSpokePools } from '../..';

vi.mock('../..', () => ({
  getSpokePools: vi.fn(),
}));
vi.mock('clients/api/queries/useGetIpLocation', () => ({
  useGetIpLocation: vi.fn(),
}));
vi.mock('clients/api/queries/useGetPools/useGetPoolsQuery', () => ({
  useGetPoolsQuery: vi.fn(),
}));

const spokePool = spokePools[0];
const collateral = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;

describe('useGetSpokePools', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'spoke');
    (getSpokePools as Mock).mockResolvedValue({ spokePools, totals: {} });
    (useGetPoolsQuery as Mock).mockReturnValue({
      data: {
        tokenMetadataMapping: {
          [collateral.vToken.underlyingToken.address.toLowerCase()]: {
            restrictedCountries: ['DE'],
            gatedCountries: ['IT'],
          },
          [loanAsset.vToken.underlyingToken.address.toLowerCase()]: {
            restrictedCountries: [],
            gatedCountries: ['DE'],
          },
        },
      },
    });
  });

  it('applies the country rules the pools API serves for each token', async () => {
    (useGetIpLocation as Mock).mockReturnValue({ data: { countryCode: 'DE' } });

    const { result } = renderHook(() => useGetSpokePools());

    await waitFor(() => expect(result.current.data).toBeDefined());

    const [pool] = result.current.data!.spokePools;
    const findAsset = (address: string) => pool.assets.find(a => a.vToken.address === address)!;

    expect(findAsset(collateral.vToken.address)).toMatchObject({
      isRestricted: true,
      isGated: false,
    });
    expect(findAsset(loanAsset.vToken.address)).toMatchObject({
      isRestricted: false,
      isGated: true,
    });
  });

  it('leaves assets unrestricted when the country is unknown', async () => {
    (useGetIpLocation as Mock).mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useGetSpokePools());

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(
      result.current.data!.spokePools[0].assets.every(
        ({ isRestricted, isGated }) => !isRestricted && !isGated,
      ),
    ).toBe(true);
  });
});
