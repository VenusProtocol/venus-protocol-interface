import BigNumber from 'bignumber.js';
import React from 'react';

import { useGetTreasuryTotals } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import Pools from '.';

vi.mock('clients/api');

describe('pages/Pools', () => {
  beforeEach(() => {
    (useGetTreasuryTotals as vi.Mock).mockImplementation(() => ({
      data: {
        treasurySupplyBalanceCents: new BigNumber(0),
        treasuryBorrowBalanceCents: new BigNumber(0),
        treasuryBalanceCents: new BigNumber(0),
        treasuryLiquidityBalanceCents: new BigNumber(0),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Pools />);
  });
});
