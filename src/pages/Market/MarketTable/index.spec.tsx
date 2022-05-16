import React from 'react';
import BigNumber from 'bignumber.js';
import renderComponent from 'testUtils/renderComponent';
import { useUserMarketInfo } from 'clients/api';
import { assetData } from '__mocks__/models/asset';
import MarketTable from '.';

jest.mock('clients/api');

describe('pages/Market/MarketTable', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: assetData,
      userTotalBorrowLimitCents: new BigNumber('111'),
      userTotalBorrowBalanceCents: new BigNumber('91'),
      userTotalSupplyBalanceCents: new BigNumber('910'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<MarketTable />);
  });
});
