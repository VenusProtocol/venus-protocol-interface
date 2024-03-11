import type Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { renderComponent } from 'testUtils/render';

import { useGetPools, useGetVTokenBalancesAll } from 'clients/api';

import useGetIsolatedPoolsTreasuryTotals, { type UseGetIsolatedPoolsTreasuryTotalsOutput } from '.';

describe('api/queries/useGetIsolatedPoolsTreasuryTotals', () => {
  beforeEach(() => {
    (useGetPools as Vi.Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));

    (useGetVTokenBalancesAll as Vi.Mock).mockImplementation(() => ({
      data: {
        balances: vTokenBalanceTreasury,
      },
    }));
  });

  it('calculates totals correctly', async () => {
    let data: UseGetIsolatedPoolsTreasuryTotalsOutput['data'];

    const CallMarketContext = () => {
      ({ data } = useGetIsolatedPoolsTreasuryTotals());
      expect(data).toMatchSnapshot();
      return <div />;
    };

    renderComponent(<CallMarketContext />);
  });
});
