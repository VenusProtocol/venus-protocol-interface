import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';

import renderComponent from 'testUtils/renderComponent';
import fakeAddress from '__mocks__/models/address';
import {
  getXvsVaultPoolsCount,
  getXvsVaultRewardWeiPerBlock,
  getXvsVaultTotalAllocationPoints,
  getXvsVaultPendingRewardWei,
  getXvsVaultPoolInfos,
  getXvsVaultUserInfo,
  getBalanceOf,
} from 'clients/api';
import useGetVaults, { UseGetVaultsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetVaults', () => {
  beforeEach(() => {
    (getXvsVaultPoolsCount as jest.Mock).mockImplementation(() => 5);
    (getXvsVaultRewardWeiPerBlock as jest.Mock).mockImplementation(() => new BigNumber('10000000'));
    (getXvsVaultTotalAllocationPoints as jest.Mock).mockImplementation(() => 100);
    (getXvsVaultPendingRewardWei as jest.Mock).mockImplementation(() => new BigNumber('200000000'));
    (getBalanceOf as jest.Mock).mockImplementation(() => '4000000000');

    (getXvsVaultPoolInfos as jest.Mock).mockImplementation(() => ({
      stakedTokenAddress: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
      allocationPoint: 10,
      lastRewardBlock: 12938791667,
      accRewardPerShare: new BigNumber('1000000'),
      lockingPeriodMs: 200000000,
    }));

    (getXvsVaultUserInfo as jest.Mock).mockImplementation(() => ({
      stakedAmountWei: new BigNumber('30000000000000'),
      pendingWithdrawalsTotalAmountWei: new BigNumber('40000000000000'),
      rewardDebtAmountWei: new BigNumber('1000000000000'),
    }));
  });

  it('fetches and returns vaults correctly', async () => {
    let data: UseGetVaultsOutput['data'] | undefined;

    const GetVaultsWrapper = () => {
      ({ data } = useGetVaults({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<GetVaultsWrapper />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    await waitFor(() => expect(data && data.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
