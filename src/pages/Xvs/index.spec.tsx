import React from 'react';
import BigNumber from 'bignumber.js';
import renderComponent from 'testUtils/renderComponent';
import { useUserMarketInfo } from 'clients/api';
import Xvs from '.';

jest.mock('clients/api');

describe('pages/Xvs', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [],
      userTotalBorrowLimitCents: new BigNumber('111'),
      userTotalBorrowBalanceCents: new BigNumber('91'),
      userTotalSupplyBalanceCents: new BigNumber('910'),
      dailyVenus: new BigNumber('22222'),
      totalXvsDistributedWei: new BigNumber('22222'),
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
