import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useGetUserMarketInfo } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import SupplyMarket from '.';

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
    renderComponent(
      <SupplyMarket
        isXvsEnabled
        supplyMarketAssets={assetData}
        accountAddress={fakeAccountAddress}
      />,
    );
  });
});
