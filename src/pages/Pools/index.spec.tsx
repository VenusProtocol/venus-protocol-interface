import BigNumber from 'bignumber.js';
import React from 'react';

import { useGetTreasuryTotals } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import Pools from '.';

jest.mock('clients/api');

describe('pages/Pools', () => {
  beforeEach(() => {
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
    renderComponent(<Pools />);
  });
});
