import BigNumber from 'bignumber.js';
import React from 'react';

import { useGetMainAssets } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import Xvs from '.';

jest.mock('clients/api');

describe('pages/Xvs', () => {
  beforeEach(() => {
    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [],
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
        totalXvsDistributedWei: new BigNumber('22222'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
