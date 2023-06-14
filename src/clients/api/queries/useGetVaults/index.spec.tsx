import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import compTrollerResponses from '__mocks__/contracts/comptroller';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { markets } from '__mocks__/models/markets';
import {
  getBalanceOf,
  getMainMarkets,
  getVaiVaultUserInfo,
  getVenusVaiVaultDailyRate,
  getXvsVaultPendingWithdrawalsFromBeforeUpgrade,
  getXvsVaultPoolCount,
  getXvsVaultPoolInfo,
  getXvsVaultRewardPerBlock,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultUserInfo,
} from 'clients/api';
import formatToVaiVaultUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToXvsVaultUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';
import renderComponent from 'testUtils/renderComponent';

import useGetVaults, { UseGetVaultsOutput } from '.';

vi.mock('clients/api');

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolCount as vi.Mock).mockImplementation(() => ({
      poolCount: xvsVaultResponses.poolLength,
    }));
    (getXvsVaultTotalAllocationPoints as vi.Mock).mockImplementation(() => ({
      totalAllocationPoints: new BigNumber(xvsVaultResponses.totalAllocPoints.toString()),
    }));
    (getXvsVaultRewardPerBlock as vi.Mock).mockImplementation(() => ({
      rewardPerBlockWei: new BigNumber(xvsVaultResponses.rewardTokenAmountsPerBlock.toString()),
    }));
    (getVenusVaiVaultDailyRate as vi.Mock).mockImplementation(() => ({
      dailyRateWei: new BigNumber(compTrollerResponses.venusVAIVaultRate.toString()),
    }));
    (getBalanceOf as vi.Mock).mockImplementation(() => ({
      balanceWei: new BigNumber('4000000000'),
    }));
    (getXvsVaultPendingWithdrawalsFromBeforeUpgrade as vi.Mock).mockImplementation(() => ({
      pendingWithdrawalsFromBeforeUpgradeWei: new BigNumber('100000'),
    }));

    (getMainMarkets as vi.Mock).mockImplementation(() => ({ markets }));

    (getVaiVaultUserInfo as vi.Mock).mockImplementation(() =>
      formatToVaiVaultUserInfo(vaiVaultResponses.userInfo),
    );

    (getXvsVaultPoolInfo as vi.Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );

    (getXvsVaultUserInfo as vi.Mock).mockImplementation(() =>
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
      authContextValue: { accountAddress: fakeAddress },
    });

    await waitFor(() => expect(!isLoading && data && data.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
