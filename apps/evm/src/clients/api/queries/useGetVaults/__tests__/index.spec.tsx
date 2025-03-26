import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import compTrollerResponses from '__mocks__/contracts/legacyPoolComptroller';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import {
  getBalanceOf,
  getVaiVaultUserInfo,
  getVenusVaiVaultDailyRate,
  getXvsVaultPendingWithdrawalsBalance,
  getXvsVaultPoolCount,
  getXvsVaultPoolInfo,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultUserInfo,
  getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade,
  getXvsVaultsTotalDailyDistributedXvs,
} from 'clients/api';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToXvsVaultUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';

import useGetVaults, { type UseGetVaultsOutput } from '..';

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
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

    (getXvsVaultPoolInfo as Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );

    (getXvsVaultUserInfo as Mock).mockImplementation(() =>
      formatToXvsVaultUserInfo(xvsVaultResponses.userInfo),
    );
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
