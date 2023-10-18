import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import { useGetTreasuryTotals } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

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
