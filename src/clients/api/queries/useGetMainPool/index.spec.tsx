import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useGetMainAssets } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetMainPool, { UseGetMainPoolOutput } from '.';

vi.mock('clients/api');

describe('api/queries/useGetMainPool', () => {
  beforeEach(() => {
    (useGetMainAssets as Vi.Mock).mockImplementation(() => ({
      data: {
        assets: assetData,
        userTotalBorrowLimitCents: new BigNumber('111'),
        userTotalBorrowBalanceCents: new BigNumber('91'),
        userTotalSupplyBalanceCents: new BigNumber('910'),
      },
      isLoading: false,
    }));
  });

  it('returns data in the correct format', async () => {
    let data: Partial<UseGetMainPoolOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetMainPool({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
