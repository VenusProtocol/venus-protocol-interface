import BigNumber from 'bignumber.js';
import React from 'react';

import { useGetMainAssets, useGetMainPoolTotalXvsDistributed } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import Xvs from '.';

vi.mock('clients/api');

describe('pages/Xvs', () => {
  beforeEach(() => {
    (useGetMainAssets as vi.Mock).mockImplementation(() => ({
      data: {
        assets: [],
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
      },
      isLoading: false,
    }));

    (useGetMainPoolTotalXvsDistributed as vi.Mock).mockImplementation(() => ({
      data: {
        totalXvsDistributedWei: new BigNumber('91823912i376'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Xvs />);
  });
});
