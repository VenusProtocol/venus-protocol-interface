import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import PoolTable from '.';

jest.mock('clients/api');

describe('pages/Pools/PoolTable', () => {
  it('renders without crashing', async () => {
    renderComponent(<PoolTable />);
  });
});
