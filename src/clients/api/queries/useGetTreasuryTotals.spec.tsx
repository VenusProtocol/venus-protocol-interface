import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { markets } from '__mocks__/models/markets';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { getMarkets, useGetVTokenBalancesAll } from 'clients/api';
import useGetTreasuryTotals, { UseGetTreasuryTotalsOutput } from './useGetTreasuryTotals';

jest.mock('clients/api');

describe('api/queries/useGetTreasuryTotals', () => {
  beforeEach(() => {
    (getMarkets as jest.Mock).mockImplementation(() => ({ markets }));

    (useGetVTokenBalancesAll as jest.Mock).mockImplementation(() => ({
      data: vTokenBalanceTreasury,
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
