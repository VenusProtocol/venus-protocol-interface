import React from 'react';

import renderComponent from 'testUtils/renderComponent';

import Swap from '.';

jest.mock('clients/api');

describe('pages/Swap', () => {
  it('renders without crashing', async () => {
    renderComponent(<Swap />);
  });
});
