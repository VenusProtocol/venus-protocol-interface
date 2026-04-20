import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import {
  fixedRatedVaults as mockFixedRateVaults,
  vaults as mockVestingVaults,
} from '__mocks__/models/vaults';
import { renderComponent } from 'testUtils/render';

import { type UseGetVaultsOutput, useGetVaults } from '..';
import { useGetFormattedFixedRatedVaults } from '../useGetFormattedFixedRatedVaults';
import { useGetVaiVault } from '../useGetVaiVault';
import { useGetVestingVaults } from '../useGetVestingVaults';

vi.mock('../useGetFormattedFixedRatedVaults', () => ({
  useGetFormattedFixedRatedVaults: vi.fn(),
}));
vi.mock('../useGetVaiVault', () => ({
  useGetVaiVault: vi.fn(),
}));
vi.mock('../useGetVestingVaults', () => ({
  useGetVestingVaults: vi.fn(),
}));

const { lockingPeriodMs: _lockingPeriodMs, ...vaiVault } = {
  ...mockVestingVaults[1],
  dailyEmissionCents: 0.0000005,
  dailyEmissionMantissa: new BigNumber('5000000000'),
  key: 'venus-VAI-XVS-0',
  rewardTokenPriceCents: new BigNumber('100'),
  stakedTokenPriceCents: new BigNumber('100'),
  stakingAprPercentage: 45625,
  totalStakedCents: 0.0000004,
  totalStakedMantissa: new BigNumber('4000000000'),
  userStakedCents: 10000000,
  userStakedMantissa: new BigNumber('100000000000000000000000'),
};

describe('useGetVaults', () => {
  beforeEach(() => {
    (useGetVestingVaults as Mock).mockReturnValue({
      data: mockVestingVaults,
      isLoading: false,
    });
    (useGetVaiVault as Mock).mockReturnValue({
      data: vaiVault,
      isLoading: false,
    });
    (useGetFormattedFixedRatedVaults as Mock).mockReturnValue({
      data: mockFixedRateVaults,
      isLoading: false,
    });
  });

  it('fetches and returns vaults correctly', async () => {
    let data: UseGetVaultsOutput['data'] | undefined;
    let isLoading = false;

    const GetVaultsWrapper = () => {
      ({ data, isLoading } = useGetVaults({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<GetVaultsWrapper />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(!isLoading && data && data.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
