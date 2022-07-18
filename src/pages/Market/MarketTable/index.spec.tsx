import BigNumber from 'bignumber.js';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import MarketTable from '.';

jest.mock('clients/api');

describe('pages/Market/MarketTable', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<MarketTable />);
  });
});
