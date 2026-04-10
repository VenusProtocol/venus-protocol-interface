import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import compTrollerResponses from '__mocks__/contracts/legacyPoolComptroller';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import {
  getVaiVaultUserInfo,
  getVenusVaiVaultDailyRate,
  getXvsVaultPoolCount,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultsTotalDailyDistributedXvs,
} from 'clients/api';

import { xvsVaultPoolInfo, xvsVaultUserInfo } from '__mocks__/models/vaults';
import { getBalanceOf } from 'clients/api/queries/getBalanceOf';
import { getXvsVaultPendingWithdrawalsBalance } from 'clients/api/queries/getXvsVaultPendingWithdrawalsBalance';
import { getXvsVaultPoolInfo } from 'clients/api/queries/getXvsVaultPoolInfo';
import { getXvsVaultUserInfo } from 'clients/api/queries/getXvsVaultUserInfo';
import { getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade } from 'clients/api/queries/getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade';
import { type UseGetVaultsOutput, useGetVaults } from '..';

vi.mock('clients/api/queries/getBalanceOf');
vi.mock('clients/api/queries/getXvsVaultPendingWithdrawalsBalance');
vi.mock('clients/api/queries/getXvsVaultPoolInfo');
vi.mock('clients/api/queries/getXvsVaultUserInfo');
vi.mock('clients/api/queries/getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade');

describe('useGetVaults', () => {
  beforeEach(() => {
    (global.fetch as Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: [] }),
      }),
    );
    (getXvsVaultPoolCount as Mock).mockImplementation(() => ({
      poolCount: xvsVaultResponses.poolLength,
    }));
    (getXvsVaultPendingWithdrawalsBalance as Mock).mockImplementation(() => ({
      balanceMantissa: new BigNumber('1000000000'),
    }));
    (getXvsVaultTotalAllocationPoints as Mock).mockImplementation(() => ({
      totalAllocationPoints: new BigNumber(xvsVaultResponses.totalAllocPoints.toString()),
    }));
    (getXvsVaultsTotalDailyDistributedXvs as Mock).mockImplementation(() => ({
      dailyDistributedXvs: new BigNumber('0.000000288'),
    }));
    (getVenusVaiVaultDailyRate as Mock).mockImplementation(() => ({
      dailyRateMantissa: new BigNumber(compTrollerResponses.venusVAIVaultRate.toString()),
    }));
    (getBalanceOf as Mock).mockImplementation(() => ({
      balanceMantissa: new BigNumber('4000000000'),
    }));
    (getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade as Mock).mockImplementation(() => ({
      userPendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber('100000'),
    }));

    (getVaiVaultUserInfo as Mock).mockImplementation(() => ({
      stakedVaiMantissa: new BigNumber('100000000000000000000000'),
    }));

    (getXvsVaultPoolInfo as Mock).mockImplementation(() => xvsVaultPoolInfo);

    (getXvsVaultUserInfo as Mock).mockImplementation(() => xvsVaultUserInfo);
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
