import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import compTrollerResponses from '__mocks__/contracts/legacyPoolComptroller';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { useGetBalanceOf } from 'clients/api/queries/getBalanceOf/useGetBalanceOf';
import { useGetTokenUsdPrice } from 'clients/api/queries/getTokenUsdPrice/useGetTokenUsdPrice';
import { useGetVaiVaultPaused } from 'clients/api/queries/getVaiVaultPaused/useGetVaiVaultPaused';
import { useGetVaiVaultUserInfo } from 'clients/api/queries/getVaiVaultUserInfo/useGetVaiVaultUserInfo';
import { useGetVenusVaiVaultDailyRate } from 'clients/api/queries/getVenusVaiVaultDailyRate/useGetVenusVaiVaultDailyRate';
import { useGetXvsVaultPaused } from 'clients/api/queries/getXvsVaultPaused/useGetXvsVaultPaused';
import { useGetXvsVaultPoolCount } from 'clients/api/queries/getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import { useGetXvsVaultTotalAllocationPoints } from 'clients/api/queries/getXvsVaultTotalAllocationPoints/useGetXvsVaultTotalAllocationPoints';
import { useGetXvsVaultsTotalDailyDistributedXvs } from 'clients/api/queries/getXvsVaultsTotalDailyDistributedXvs/useGetXvsVaultsTotalDailyDistributedXvs';
import { renderComponent } from 'testUtils/render';

import { xvsVaultPoolInfo, xvsVaultUserInfo } from '__mocks__/models/vaults';
import { type UseGetVaultsOutput, useGetVaults } from '..';
import { useGetXvsVaultPoolBalances } from '../useGetVestingVaults/useGetXvsVaultPoolBalances';
import { useGetXvsVaultPools } from '../useGetVestingVaults/useGetXvsVaultPools';

vi.mock('clients/api/queries/getBalanceOf/useGetBalanceOf', () => ({
  useGetBalanceOf: vi.fn(),
}));
vi.mock('clients/api/queries/getTokenUsdPrice/useGetTokenUsdPrice', () => ({
  useGetTokenUsdPrice: vi.fn(),
}));
vi.mock('clients/api/queries/getVaiVaultPaused/useGetVaiVaultPaused', () => ({
  useGetVaiVaultPaused: vi.fn(),
}));
vi.mock('clients/api/queries/getVaiVaultUserInfo/useGetVaiVaultUserInfo', () => ({
  useGetVaiVaultUserInfo: vi.fn(),
}));
vi.mock('clients/api/queries/getVenusVaiVaultDailyRate/useGetVenusVaiVaultDailyRate', () => ({
  useGetVenusVaiVaultDailyRate: vi.fn(),
}));
vi.mock('clients/api/queries/getXvsVaultPaused/useGetXvsVaultPaused', () => ({
  useGetXvsVaultPaused: vi.fn(),
}));
vi.mock('clients/api/queries/getXvsVaultPoolCount/useGetXvsVaultPoolCount', () => ({
  useGetXvsVaultPoolCount: vi.fn(),
}));
vi.mock(
  'clients/api/queries/getXvsVaultTotalAllocationPoints/useGetXvsVaultTotalAllocationPoints',
  () => ({
    useGetXvsVaultTotalAllocationPoints: vi.fn(),
  }),
);
vi.mock(
  'clients/api/queries/getXvsVaultsTotalDailyDistributedXvs/useGetXvsVaultsTotalDailyDistributedXvs',
  () => ({
    useGetXvsVaultsTotalDailyDistributedXvs: vi.fn(),
  }),
);
vi.mock('../useGetVestingVaults/useGetXvsVaultPools', () => ({
  useGetXvsVaultPools: vi.fn(),
}));
vi.mock('../useGetVestingVaults/useGetXvsVaultPoolBalances', () => ({
  useGetXvsVaultPoolBalances: vi.fn(),
}));

describe('useGetVaults', () => {
  beforeEach(() => {
    const poolQueryResults = Array.from({ length: xvsVaultResponses.poolLength }).flatMap(() => [
      {
        data: xvsVaultPoolInfo,
        isLoading: false,
      },
      {
        data: {
          balanceMantissa: new BigNumber('1000000000'),
        },
        isLoading: false,
      },
      {
        data: xvsVaultUserInfo,
        isLoading: false,
      },
      {
        data: {
          userPendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber('100000'),
        },
        isLoading: false,
      },
    ]);

    const poolBalanceQueryResults = Array.from({ length: xvsVaultResponses.poolLength }).map(
      () => ({
        data: {
          balanceMantissa: new BigNumber('4000000000'),
        },
        isLoading: false,
      }),
    );

    (useGetXvsVaultPoolCount as Mock).mockReturnValue({
      data: {
        poolCount: xvsVaultResponses.poolLength,
      },
      isLoading: false,
    });
    (useGetXvsVaultPools as Mock).mockReturnValue(poolQueryResults);
    (useGetXvsVaultPoolBalances as Mock).mockReturnValue(poolBalanceQueryResults);
    (useGetXvsVaultTotalAllocationPoints as Mock).mockReturnValue({
      data: {
        totalAllocationPoints: new BigNumber(xvsVaultResponses.totalAllocPoints.toString()),
      },
      isLoading: false,
    });
    (useGetXvsVaultsTotalDailyDistributedXvs as Mock).mockReturnValue({
      data: {
        dailyDistributedXvs: new BigNumber('0.000000288'),
      },
      isLoading: false,
    });
    (useGetXvsVaultPaused as Mock).mockReturnValue({
      data: {
        isVaultPaused: false,
      },
      isLoading: false,
    });
    (useGetVenusVaiVaultDailyRate as Mock).mockReturnValue({
      data: {
        dailyRateMantissa: new BigNumber(compTrollerResponses.venusVAIVaultRate.toString()),
      },
      isLoading: false,
    });
    (useGetTokenUsdPrice as Mock).mockReturnValue({
      data: {
        tokenPriceUsd: new BigNumber(1),
      },
      isLoading: false,
    });
    (useGetVaiVaultPaused as Mock).mockReturnValue({
      data: {
        isVaultPaused: false,
      },
      isLoading: false,
    });
    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: new BigNumber('4000000000'),
      },
      isLoading: false,
    });
    (useGetVaiVaultUserInfo as Mock).mockReturnValue({
      data: {
        stakedVaiMantissa: new BigNumber('100000000000000000000000'),
      },
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
