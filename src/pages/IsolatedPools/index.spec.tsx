import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import { renderComponent } from 'testUtils/render';

import { useGetTreasuryTotals } from 'clients/api';

import Pools from '.';

describe('pages/Pools', () => {
  beforeEach(() => {
    (useGetTreasuryTotals as Vi.Mock).mockImplementation(() => ({
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
