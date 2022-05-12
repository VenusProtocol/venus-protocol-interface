import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import Market from '.';

jest.mock('clients/api');

describe('pages/Market', () => {
  it('renders without crashing', async () => {
    renderComponent(<Market />);
  });
});
