import React from 'react';
import Vi from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { renderComponent } from 'testUtils/render';

import { useGetPools, useGetVTokenBalancesAll } from 'clients/api';

import useGetTreasuryTotals, { UseGetTreasuryTotalsOutput } from '.';

describe('api/queries/useGetTreasuryTotals', () => {
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
    let data: UseGetTreasuryTotalsOutput['data'];

    const CallMarketContext = () => {
      ({ data } = useGetTreasuryTotals());
      expect(data).toMatchSnapshot();
      return <div />;
    };

    renderComponent(<CallMarketContext />);
  });
});
