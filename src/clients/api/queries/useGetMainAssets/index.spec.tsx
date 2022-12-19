import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { assetsInAccount } from '__mocks__/models/assetsInAccount';
import { markets } from '__mocks__/models/markets';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { vTokenBalancesAccount } from '__mocks__/models/vTokenBalancesAccount';
import {
  getAssetsInAccount,
  getMainMarkets,
  getMintedVai,
  useGetVTokenBalancesAll,
} from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetMainAssets, { UseGetMainAssetsOutput } from '.';

jest.mock('clients/api');

const fakeUserVaiMintedWei = new BigNumber('10000000000000000');

describe('api/queries/useGetMainAssets', () => {
  beforeEach(() => {
    (getMainMarkets as jest.Mock).mockImplementation(() => ({ markets }));
    (getAssetsInAccount as jest.Mock).mockImplementation(() => ({
      tokenAddresses: assetsInAccount,
    }));
    (getMintedVai as jest.Mock).mockImplementation(() => ({
      mintedVaiWei: fakeUserVaiMintedWei,
    }));

    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(({ account }) => {
      if (account === fakeAddress) {
        return { data: { balances: vTokenBalancesAccount } };
      }
      return { data: { balances: vTokenBalanceTreasury } };
    });
  });

  it('calculates totals correctly', async () => {
    let data: UseGetMainAssetsOutput['data'] = {
      assets: [],
      userTotalBorrowBalanceCents: new BigNumber(0),
      userTotalBorrowLimitCents: new BigNumber(0),
      userTotalSupplyBalanceCents: new BigNumber(0),
      totalXvsDistributedWei: new BigNumber(0),
      dailyVenusWei: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetMainAssets({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />, {
      authContextValue: { account: { address: fakeAddress } },
    });

    await waitFor(() => expect(data.assets.length > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
