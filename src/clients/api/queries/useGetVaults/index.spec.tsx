import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import compTrollerResponses from '__mocks__/contracts/mainPoolComptroller';
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

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolCount as Vi.Mock).mockImplementation(() => ({
      poolCount: xvsVaultResponses.poolLength,
    }));
    (getXvsVaultTotalAllocationPoints as Vi.Mock).mockImplementation(() => ({
      totalAllocationPoints: new BigNumber(xvsVaultResponses.totalAllocPoints.toString()),
    }));
    (getXvsVaultRewardPerBlock as Vi.Mock).mockImplementation(() => ({
      rewardPerBlockWei: new BigNumber(xvsVaultResponses.rewardTokenAmountsPerBlock.toString()),
    }));
    (getVenusVaiVaultDailyRate as Vi.Mock).mockImplementation(() => ({
      dailyRateWei: new BigNumber(compTrollerResponses.venusVAIVaultRate.toString()),
    }));
    (getBalanceOf as Vi.Mock).mockImplementation(() => ({
      balanceWei: new BigNumber('4000000000'),
    }));
    (getXvsVaultPendingWithdrawalsFromBeforeUpgrade as Vi.Mock).mockImplementation(() => ({
      pendingWithdrawalsFromBeforeUpgradeWei: new BigNumber('100000'),
    }));

    (getMainMarkets as Vi.Mock).mockImplementation(() => ({ markets }));

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
      authContextValue: { accountAddress: fakeAddress },
    });

    await waitFor(() => expect(!isLoading && data && data.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
