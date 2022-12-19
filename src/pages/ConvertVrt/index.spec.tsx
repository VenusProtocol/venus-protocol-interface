import BigNumber from 'bignumber.js';
import React from 'react';

import { assetData } from '__mocks__/models/asset';
import { useGetMainAssets } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import ConvertVrt from '.';

jest.mock('clients/api');

describe('pages/ConvertVRT', () => {
  beforeEach(() => {
    (useGetMainAssets as jest.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<ConvertVrt />);
  });
});
