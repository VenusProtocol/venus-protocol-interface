import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import compTrollerResponses from '__mocks__/contracts/comptroller';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { markets } from '__mocks__/models/markets';
import {
  getBalanceOf,
  getMainMarkets,
  getVaiVaultPendingXvs,
  getVaiVaultUserInfo,
  getVenusVaiVaultDailyRate,
  getVrtVaultAccruedInterest,
  getVrtVaultInterestRatePerBlock,
  getVrtVaultUserInfo,
  getXvsVaultPendingReward,
  getXvsVaultPoolCount,
  getXvsVaultPoolInfo,
  getXvsVaultRewardPerBlock,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultUserInfo,
} from 'clients/api';
import formatToVaiVaultUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import formatToVrtVaultUserInfo from 'clients/api/queries/getVrtVaultUserInfo/formatToUserInfo';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToXvsVaultUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';
import renderComponent from 'testUtils/renderComponent';

import useGetVaults, { UseGetVaultsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolCount as jest.Mock).mockImplementation(() => ({
      poolCount: xvsVaultResponses.poolLength,
    }));
    (getXvsVaultTotalAllocationPoints as jest.Mock).mockImplementation(() => ({
      totalAllocationPoints: xvsVaultResponses.totalAllocPoints,
    }));
    (getXvsVaultRewardPerBlock as jest.Mock).mockImplementation(() => ({
      rewardPerBlockWei: new BigNumber(xvsVaultResponses.rewardTokenAmountsPerBlock),
    }));
    (getXvsVaultPendingReward as jest.Mock).mockImplementation(() => ({
      pendingXvsReward: new BigNumber(xvsVaultResponses.pendingReward),
    }));
    (getVaiVaultPendingXvs as jest.Mock).mockImplementation(() => ({
      pendingXvsWei: new BigNumber(vaiVaultResponses.pendingXVS),
    }));
    (getVenusVaiVaultDailyRate as jest.Mock).mockImplementation(() => ({
      dailyRateWei: new BigNumber(compTrollerResponses.venusVAIVaultRate),
    }));
    (getVrtVaultAccruedInterest as jest.Mock).mockImplementation(() => ({
      accruedInterestWei: new BigNumber(vrtVaultResponses.getAccruedInterest),
    }));
    (getVrtVaultInterestRatePerBlock as jest.Mock).mockImplementation(() => ({
      interestRatePerBlockWei: new BigNumber(vrtVaultResponses.interestRatePerBlock),
    }));
    (getBalanceOf as jest.Mock).mockImplementation(() => ({
      balanceWei: new BigNumber('4000000000'),
    }));
    (getMainMarkets as jest.Mock).mockImplementation(() => ({ markets }));

    (getVaiVaultUserInfo as jest.Mock).mockImplementation(() =>
      formatToVaiVaultUserInfo(vaiVaultResponses.userInfo),
    );

    (getXvsVaultPoolInfo as jest.Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );

    (getXvsVaultUserInfo as jest.Mock).mockImplementation(() =>
      formatToXvsVaultUserInfo(xvsVaultResponses.userInfo),
    );

    (getVrtVaultUserInfo as jest.Mock).mockImplementation(() =>
      formatToVrtVaultUserInfo(vrtVaultResponses.userInfo),
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
      authContextValue: { account: { address: fakeAddress } },
    });

    await waitFor(() => expect(!isLoading && data && data.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
