import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import History from '.';

jest.mock('clients/api');

describe('pages/History', () => {
  it('renders without crashing', async () => {
    renderComponent(<History />);
  });
});
