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
    let treasuryTotalUsdBalance: BigNumber;
    let treasuryTotalSupplyUsdBalance: BigNumber;
    let treasuryTotalBorrowUsdBalance: BigNumber;
    let treasuryTotalAvailableLiquidityUsdBalance: BigNumber;
    const CallMarketContext = () => {
      ({
        assets,
        userTotalBorrowBalance,
        userTotalBorrowLimit,
        userTotalSupplyBalance,
        treasuryTotalUsdBalance,
        treasuryTotalSupplyUsdBalance,
        treasuryTotalBorrowUsdBalance,
        treasuryTotalAvailableLiquidityUsdBalance,
      } = useUserMarketInfo({ accountAddress: fakeAddress }));
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
    await waitFor(() =>
      expect(treasuryTotalUsdBalance.toFixed()).toBe('6744000847.35474642509783918968428126'),
    );
    await waitFor(() =>
      expect(treasuryTotalSupplyUsdBalance.toFixed()).toBe(
        '1009809011846086109330217.375449451699026548',
      ),
    );
    await waitFor(() =>
      expect(treasuryTotalBorrowUsdBalance.toFixed()).toBe('8587791534566.260141326894326108'),
    );
    await waitFor(() =>
      expect(treasuryTotalAvailableLiquidityUsdBalance.toFixed()).toBe(
        '1009809011837545745832691.419939998914208345',
      ),
    );
  });
});
