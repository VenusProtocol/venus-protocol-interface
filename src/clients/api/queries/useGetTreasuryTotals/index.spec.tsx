import React from 'react';

import { markets } from '__mocks__/models/markets';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { getMainMarkets, useGetVTokenBalancesAll } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetTreasuryTotals, { UseGetTreasuryTotalsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetTreasuryTotals', () => {
  beforeEach(() => {
    (getMainMarkets as jest.Mock).mockImplementation(() => ({ markets }));

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
