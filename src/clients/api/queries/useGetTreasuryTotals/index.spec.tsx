import React from 'react';

import { poolData } from '__mocks__/models/pools';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { useGetPools, useGetVTokenBalancesAll } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetTreasuryTotals, { UseGetTreasuryTotalsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetTreasuryTotals', () => {
  beforeEach(() => {
    (useGetPools as jest.Mock).mockImplementation(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    }));

    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(() => ({
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
