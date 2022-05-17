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
    (getMarkets as jest.Mock).mockImplementation(() => ({ markets }));
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
    let userTotalBorrowBalanceCents: BigNumber;
    let userTotalBorrowLimitCents: BigNumber;
    let userTotalSupplyBalanceCents: BigNumber;
    let treasuryTotalUsdBalanceCents: BigNumber;
    let treasuryTotalSupplyUsdBalanceCents: BigNumber;
    let treasuryTotalBorrowUsdBalanceCents: BigNumber;
    let treasuryTotalAvailableLiquidityUsdBalanceCents: BigNumber;
    const CallMarketContext = () => {
      ({
        assets,
        userTotalBorrowBalanceCents,
        userTotalBorrowLimitCents,
        userTotalSupplyBalanceCents,
        treasuryTotalUsdBalanceCents,
        treasuryTotalSupplyUsdBalanceCents,
        treasuryTotalBorrowUsdBalanceCents,
        treasuryTotalAvailableLiquidityUsdBalanceCents,
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
      expect(userTotalBorrowBalanceCents.toFixed()).toBe('6316414757.467084058156978936843085'),
    );
    await waitFor(() =>
      expect(userTotalBorrowLimitCents.toFixed()).toBe('13871432693.34798845110528092688405'),
    );
    await waitFor(() =>
      expect(userTotalSupplyBalanceCents.toFixed()).toBe('18411477984.631676380304982489610572'),
    );
    await waitFor(() =>
      expect(treasuryTotalUsdBalanceCents.toFixed()).toBe('674400084735.474642509783918968428126'),
    );
    await waitFor(() =>
      expect(treasuryTotalSupplyUsdBalanceCents.toFixed()).toBe(
        '100980901184608610933021737.5449451699026548',
      ),
    );
    await waitFor(() =>
      expect(treasuryTotalBorrowUsdBalanceCents.toFixed()).toBe('858779153456626.0141326894326108'),
    );
    await waitFor(() =>
      expect(treasuryTotalAvailableLiquidityUsdBalanceCents.toFixed()).toBe(
        '100980901183754574583269141.9939998914208345',
      ),
    );
  });
});
