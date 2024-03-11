import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import { renderComponent } from 'testUtils/render';

import { useGetIsolatedPoolsTreasuryTotals } from 'clients/api';

import Pools from '.';

describe('pages/Pools', () => {
  beforeEach(() => {
    (useGetIsolatedPoolsTreasuryTotals as Vi.Mock).mockImplementation(() => ({
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
