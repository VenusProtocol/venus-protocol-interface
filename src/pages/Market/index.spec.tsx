import React from 'react';
import BigNumber from 'bignumber.js';
import renderComponent from 'testUtils/renderComponent';
import { getMarkets, useGetVTokenBalancesAll, useGetTreasuryTotals } from 'clients/api';
import { markets } from '__mocks__/models/markets';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import Market from '.';

jest.mock('clients/api');

describe('pages/Market', () => {
  beforeEach(() => {
    (getMarkets as jest.Mock).mockImplementation(() => ({ markets }));
    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(() => ({
      data: vTokenBalanceTreasury,
    }));
    (useGetTreasuryTotals as jest.Mock).mockImplementation(() => ({
      data: {
        treasuryTotalSupplyBalanceCents: new BigNumber(0),
        treasuryTotalBorrowBalanceCents: new BigNumber(0),
        treasuryTotalBalanceCents: new BigNumber(0),
        treasuryTotalAvailableLiquidityBalanceCents: new BigNumber(0),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Market />);
  });
});
