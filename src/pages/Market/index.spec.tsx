import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { useGetUserMarketInfo } from 'clients/api';
import Market from '.';

jest.mock('clients/api');

describe('pages/Market', () => {
  beforeEach(() => {
    (useGetUserMarketInfo as jest.Mock).mockImplementation(() => ({
      data: {
        assets: [], // Not used in these tests
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Market />);
  });
});
