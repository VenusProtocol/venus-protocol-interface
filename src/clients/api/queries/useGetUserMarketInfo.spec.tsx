import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';
import renderComponent from 'testUtils/renderComponent';
import { assetsInAccount } from '__mocks__/models/assetsInAccount';
import { markets } from '__mocks__/models/markets';
import { vTokenBalancesAccount } from '__mocks__/models/vTokenBalancesAccount';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import fakeAddress from '__mocks__/models/address';
import { getAssetsInAccount, getMarkets, useGetVTokenBalancesAll } from 'clients/api';
import useGetUserMarketInfo, { UseGetUserMarketInfoOutput } from './useGetUserMarketInfo';

jest.mock('clients/api');

const fakeUserVaiMinted = new BigNumber('1000000');

describe('api/queries/useGetUserMarketInfo', () => {
  beforeEach(() => {
    (getMarkets as jest.Mock).mockImplementation(() => ({ markets }));
    (getAssetsInAccount as jest.Mock).mockImplementation(() => assetsInAccount);

    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(({ account }) => {
      if (account === fakeAddress) {
        return { data: vTokenBalancesAccount };
      }
      return { data: vTokenBalanceTreasury };
    });
  });

  it('calculates totals correctly', async () => {
    let data: UseGetUserMarketInfoOutput['data'] = {
      assets: [],
      userTotalBorrowBalanceCents: new BigNumber(0),
      userTotalBorrowLimitCents: new BigNumber(0),
      userTotalSupplyBalanceCents: new BigNumber(0),
      totalXvsDistributedWei: new BigNumber(0),
      dailyVenusWei: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetUserMarketInfo({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />, {
      authContextValue: { account: { address: fakeAddress } },
      vaiContextValue: {
        userVaiEnabled: true,
        userVaiMinted: fakeUserVaiMinted,
        mintableVai: new BigNumber(0),
        userVaiBalance: new BigNumber(0),
      },
    });

    await waitFor(() => expect(data.assets.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
