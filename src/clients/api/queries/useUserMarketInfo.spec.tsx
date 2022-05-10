import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor } from '@testing-library/react';
import renderComponent from 'testUtils/renderComponent';
import { assetsInAccount } from '__mocks__/models/assetsInAccount';
import { markets } from '__mocks__/models/markets';
import { vTokenBalancesAccount } from '__mocks__/models/vTokenBalancesAccount';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import fakeAddress from '__mocks__/models/address';
import {
  getAssetsInAccount,
  getMarkets,
  useGetVTokenBalancesAll,
  useGetHypotheticalLiquidityQueries,
} from 'clients/api';
import { Asset } from 'types';
import useUserMarketInfo from './useUserMarketInfo';

jest.mock('clients/api');

const fakeUserVaiMinted = new BigNumber('1000000');

describe('pages/SupplyMarket', () => {
  beforeEach(() => {
    (getMarkets as jest.Mock).mockImplementation(() => markets);
    (getAssetsInAccount as jest.Mock).mockImplementation(() => assetsInAccount);
    (useGetHypotheticalLiquidityQueries as jest.Mock).mockImplementation(() =>
      markets.map(() => '68247906490737205226143250'),
    );
    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(({ account }) => {
      if (account === fakeAddress) {
        return { data: vTokenBalancesAccount };
      }
      return { data: vTokenBalanceTreasury };
    });
  });

  it('calculates totals correctly', async () => {
    let assets: Asset[];
    let userTotalBorrowBalance: BigNumber;
    let userTotalBorrowLimit: BigNumber;
    let userTotalSupplyBalance: BigNumber;
    const CallMarketContext = () => {
      ({ assets, userTotalBorrowBalance, userTotalBorrowLimit, userTotalSupplyBalance } =
        useUserMarketInfo({ accountAddress: fakeAddress }));
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
    await waitFor(() => expect(assets).toBeTruthy());
    await waitFor(() =>
      expect(userTotalBorrowBalance.toFixed()).toBe('63164147.57467084058156978936843085'),
    );
    await waitFor(() =>
      expect(userTotalBorrowLimit.toFixed()).toBe('138714326.9334798845110528092688405'),
    );
    await waitFor(() =>
      expect(userTotalSupplyBalance.toFixed()).toBe('184114779.84631676380304982489610572'),
    );
  });
});
