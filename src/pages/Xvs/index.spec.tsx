import React from 'react';
import BigNumber from 'bignumber.js';
import renderComponent from 'testUtils/renderComponent';
import { useGetUserMarketInfo } from 'clients/api';
import Xvs from '.';

jest.mock('clients/api');

describe('pages/Xvs', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [],
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
        dailyVenusWei: new BigNumber('22222'),
        totalXvsDistributedWei: new BigNumber('22222'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
