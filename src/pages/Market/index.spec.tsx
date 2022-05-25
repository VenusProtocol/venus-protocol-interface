import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { useUserMarketInfo } from 'clients/api';
import Market from '.';

jest.mock('clients/api');

describe('pages/Market', () => {
  beforeEach(() => {
    (useUserMarketInfo as jest.Mock).mockImplementation(() => ({
      assets: [], // Not used in these tests
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Market />);
  });
});
