import BigNumber from 'bignumber.js';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import BorrowMarket from '.';

jest.mock('clients/api');

describe('pages/SupplyMarket', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<BorrowMarket isXvsEnabled borrowMarketAssets={[]} />);
  });
});
