import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import compTrollerResponses from '__mocks__/contracts/legacyPoolComptroller';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
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
import formatToVaiVaultUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToXvsVaultUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';

import useGetVaults, { type UseGetVaultsOutput } from '..';

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolCount as Vi.Mock).mockImplementation(() => ({
      poolCount: xvsVaultResponses.poolLength,
    }));
    (getXvsVaultPendingWithdrawalsBalance as Vi.Mock).mockImplementation(() => ({
      balanceMantissa: new BigNumber('1000000000'),
    }));
    (getXvsVaultTotalAllocationPoints as Vi.Mock).mockImplementation(() => ({
      totalAllocationPoints: new BigNumber(xvsVaultResponses.totalAllocPoints.toString()),
    }));
    (getXvsVaultsTotalDailyDistributedXvs as Vi.Mock).mockImplementation(() => ({
      dailyDistributedXvs: new BigNumber('0.000000288'),
    }));
    (getVenusVaiVaultDailyRate as Vi.Mock).mockImplementation(() => ({
      dailyRateMantissa: new BigNumber(compTrollerResponses.venusVAIVaultRate.toString()),
    }));
    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceMantissa: new BigNumber('4000000000'),
    }));
    (getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade as Vi.Mock).mockImplementation(() => ({
      userPendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber('100000'),
    }));

    (getVaiVaultUserInfo as Vi.Mock).mockImplementation(() =>
      formatToVaiVaultUserInfo(vaiVaultResponses.userInfo),
    );

    (getXvsVaultPoolInfo as Vi.Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );

    (getXvsVaultUserInfo as Vi.Mock).mockImplementation(() =>
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
