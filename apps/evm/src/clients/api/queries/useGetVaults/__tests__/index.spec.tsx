import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { fixedRatedVaults, vaults } from '__mocks__/models/vaults';
import { renderHook } from 'testUtils/render';

import { useGetVaults } from '..';
import { useGetFormattedFixedRatedVaults } from '../useGetFormattedFixedRatedVaults';
import { useGetVaiVault } from '../useGetVaiVault';
import { useGetVestingVaults } from '../useGetVestingVaults';

vi.mock('../useGetFormattedFixedRatedVaults');
vi.mock('../useGetVaiVault');
vi.mock('../useGetVestingVaults');

const fakeVaiVault = vaults[0];
const fakeVestingVaults = [vaults[1]];

describe('useGetVaults', () => {
  beforeEach(() => {
    (useGetVestingVaults as Mock).mockImplementation(() => ({
      data: fakeVestingVaults,
      isLoading: false,
    }));
    (useGetVaiVault as Mock).mockImplementation(() => ({
      data: fakeVaiVault,
      isLoading: false,
    }));
    (useGetFormattedFixedRatedVaults as Mock).mockImplementation(() => ({
      data: fixedRatedVaults,
      isLoading: false,
    }));
  });

  it('returns vesting, VAI, and fixed-rate vaults in a single list', async () => {
    const { result } = renderHook(() => useGetVaults({ accountAddress: fakeAddress }));

    expect(result).toMatchSnapshot();
  });
});
