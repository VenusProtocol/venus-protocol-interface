import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';

import { markets } from '__mocks__/models/markets';
import renderComponent from 'testUtils/renderComponent';
import fakeAddress from '__mocks__/models/address';
import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import vaiVaultResponses from '__mocks__/contracts/vaiVault';
import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import compTrollerResponses from '__mocks__/contracts/comptroller';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToXvsVaultUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';
import formatToVaiVaultUserInfo from 'clients/api/queries/getVaiVaultUserInfo/formatToUserInfo';
import formatToVrtVaultUserInfo from 'clients/api/queries/getVrtVaultUserInfo/formatToUserInfo';
import {
  getXvsVaultPoolsCount,
  getXvsVaultRewardWeiPerBlock,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultPendingRewardWei,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
  getBalanceOf,
  getVenusVaiVaultDailyRateWei,
  getMarkets,
  getVaiVaultUserInfo,
  getVaiVaultPendingXvsWei,
  getVrtVaultAccruedInterestWei,
  getVrtVaultInterestRatePerBlock,
  getVrtVaultUserInfo,
} from 'clients/api';
import useGetVaults, { UseGetVaultsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolsCount as jest.Mock).mockImplementation(() => xvsVaultResponses.poolLength);
    (getXvsVaultTotalAllocationPoints as jest.Mock).mockImplementation(
      () => xvsVaultResponses.totalAllocPoints,
    );
    (getXvsVaultRewardWeiPerBlock as jest.Mock).mockImplementation(
      () => new BigNumber(xvsVaultResponses.rewardTokenAmountsPerBlock),
    );
    (getXvsVaultPendingRewardWei as jest.Mock).mockImplementation(
      () => new BigNumber(xvsVaultResponses.pendingReward),
    );
    (getVaiVaultPendingXvsWei as jest.Mock).mockImplementation(
      () => new BigNumber(vaiVaultResponses.pendingXVS),
    );
    (getVenusVaiVaultDailyRateWei as jest.Mock).mockImplementation(
      () => new BigNumber(compTrollerResponses.venusVAIVaultRate),
    );
    (getVrtVaultAccruedInterestWei as jest.Mock).mockImplementation(
      () => new BigNumber(vrtVaultResponses.getAccruedInterest),
    );
    (getVrtVaultInterestRatePerBlock as jest.Mock).mockImplementation(
      () => new BigNumber(vrtVaultResponses.interestRatePerBlock),
    );
    (getBalanceOf as jest.Mock).mockImplementation(() => new BigNumber('4000000000'));
    (getMarkets as jest.Mock).mockImplementation(() => ({ markets }));

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
