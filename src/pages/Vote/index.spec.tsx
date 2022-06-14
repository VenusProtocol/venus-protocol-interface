import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import { useGetVestingVaults } from 'clients/api';
import Vote from '.';

jest.mock('clients/api');

describe('pages/Vote', () => {
  beforeEach(() => {
    (useGetVestingVaults as jest.Mock).mockImplementation(() => ({
      data: [],
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<Vote />);
  });
});
