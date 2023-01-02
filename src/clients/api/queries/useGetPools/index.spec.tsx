import { waitFor } from '@testing-library/react';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetMainPool } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetPools, { UseGetPoolsOutput } from '.';

jest.mock('clients/api');

describe('api/queries/useGetPools', () => {
  beforeEach(() => {
    (useGetMainPool as jest.Mock).mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));
  });

  it('returns data in the correct format', async () => {
    let data: Partial<UseGetPoolsOutput['data']> = {};

    const CallMarketContext = () => {
      ({ data } = useGetPools({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(!!data).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
